import os
import random
import shutil
import string
import subprocess
from ast import literal_eval

from django.conf import settings
from rest_framework import generics
from rest_framework.response import Response

from . import serializers
from .ml import preprocesing
from .ml.data_loader import DataLoader
from .ml.predictor import ResNetPredictor
from .models import ModelOutput, PatientInfo


class PredictAPIView(generics.GenericAPIView):
    serializer_class = serializers.PredictSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        patient_id = serializer.validated_data['patient_id']

        patient_data = PatientInfo.objects.get(id=patient_id)

        preprocessed_file_path = patient_data.preprocessed_file_path if patient_data.preprocessed_file_path else patient_data.file.path

        dl = DataLoader(preprocessed_file_path, batch_size = settings.ML_BATCH_SIZE, is_folder=patient_data.file_type == 'video')

        rnp = ResNetPredictor(
            model_weights_path=settings.ML_MODEL_PATH,
            data_loader=dl)
        predicted_class, normal_pred_proba_lst, patho_pred_proba_lst = rnp.predict()
        grad_path, overlayed_path = rnp.get_gradcam()
        # print(normal_pred_proba_lst)
        for i in range(len(predicted_class)):

            mo = ModelOutput.objects.create(
                patient=patient_data,
                predicted_class=predicted_class[i],
                predicted_probas_normal=normal_pred_proba_lst[i],
                predicted_probas_pathological = patho_pred_proba_lst[i],
                file_number = i

,
            )
            mo.save()


        base_path = settings.BASE_DIR

        grad_path = grad_path.replace(str(base_path), '')
        overlayed_path = overlayed_path.replace(str(base_path), '')

 
        patient_data.grad_images = str(grad_path).replace('\\', '/')
        patient_data.overlayed_images = str(overlayed_path).replace('\\', '/')
        patient_data.save()

        if patient_data.file_type == 'image':
            preprocessed_base_path = settings.PREPROCESSED_PATH
            
            # Get random 10 length string
            rand  = ''.join(random.choices(string.ascii_uppercase + string.digits, k = 10))
            folder_path = preprocessed_base_path + '//' + rand
            if not os.path.exists(preprocessed_base_path):
                os.mkdir(preprocessed_base_path)
            
            os.mkdir(folder_path)
            file_path = os.path.join(folder_path, f'0.{settings.IMAGE_FORMAT}')
            shutil.copy(patient_data.file.path, file_path)

            patient_data.preprocessed_file_path = folder_path

            patient_data.preprocessed_file_number = 1
            patient_data.save()
            


        return Response({
            'patient_id': patient_id,
        }, 200)

        
        
class PatientInfoAPIView(generics.GenericAPIView):

    serializer_class = serializers.PatientInfoSerializer
    lookup_field = 'id'
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, 200)
    
    # Get for one pk
    def get(self, request, id):
        patient_data = PatientInfo.objects.get(id=id)
        serializer = self.get_serializer(patient_data)
        out_data = serializer.data
        host = request.get_host()

        if patient_data.preprocessed_file_path:
            host_preprocessed_path = "/".join([host, patient_data.preprocessed_file_path])
            out_data['preprocessed_file_path'] = host_preprocessed_path

        if patient_data.grad_images:
            host_grad_path = "".join([host, patient_data.grad_images])
            out_data['grad_images'] = host_grad_path

        if patient_data.overlayed_images:
            host_overlayed_path = "".join([host, patient_data.overlayed_images])
            out_data['overlayed_images'] = host_overlayed_path
        
        predict_info = ModelOutput.objects.filter(patient=patient_data)
        
      
        predict_out = {}
        for predict in predict_info:
            data = serializers.ModelOutputSerializer(predict).data
            predict_out[data['file_number']] = {
                'predicted_class': data['predicted_class'],
                'predicted_probas_normal': literal_eval(data['predicted_probas_normal']),
                'predicted_probas_pathological': literal_eval(data['predicted_probas_pathological'])
            }


        
        out_data['output'] = predict_out
        return Response(out_data, 200)


class PatientListAPIView(generics.ListAPIView):
    serializer_class = serializers.PatientInfoSerializer
    def get_queryset(self):
        return PatientInfo.objects.all()

class PatientDestroyAPIView(generics.DestroyAPIView):
    serializer_class = serializers.PatientInfoSerializer
    lookup_field = 'id'
    def get_queryset(self):
        return PatientInfo.objects.all()

class VideoToImageAPIView(generics.GenericAPIView):

    serializer_class = serializers.VideoToImageSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        patient_id = serializer.validated_data['patient_id']

        patient_data = PatientInfo.objects.get(id=patient_id)

        file_path = patient_data.file.path

        folder_path, count = preprocesing.convert_video_to_image(file_path)

       
       
        patient_data.preprocessed_file_path = folder_path.replace('//', '/')
        patient_data.preprocessed_file_number = count
        patient_data.save()
        return Response(serializer.data, 200)
    

class ImageResizeAPIView(generics.GenericAPIView):

    serializer_class = serializers.ImageResizeSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        patient_id = serializer.validated_data['patient_id']
    

        patient_data = PatientInfo.objects.get(id=patient_id)
        
     
        file_type = patient_data.file_type
        # print(file_type)
        if file_type == 'image':
            file_path = patient_data.file.path
            preprocesing.convert_to_size(file_path)
        else:
            folder_path = patient_data.preprocessed_file_path
            num_files = patient_data.preprocessed_file_number

            for i in range(num_files):
                file_name = f'{i}.{settings.IMAGE_FORMAT}'
                file_path = os.path.join(folder_path, file_name)
                preprocesing.convert_to_size(file_path)
       
        return Response(serializer.data, 200)


class VideoCropAPIView(generics.GenericAPIView):

    serializer_class = serializers.VideoCropSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        patient_id = serializer.validated_data['patient_id']

        base_path = settings.BASE_DIR
        temp_dir = os.path.join(base_path, settings.TEMP_PATH)

        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)

        patient_data = PatientInfo.objects.get(id=patient_id)
        video_name = patient_data.file.path
        


        x = literal_eval(serializer.validated_data['x'])
        y = literal_eval(serializer.validated_data['y'])
        w = literal_eval(serializer.validated_data['w'])
        h = literal_eval(serializer.validated_data['h'])
        
        output_name = os.path.join(temp_dir, 'output.mp4')

        

        ffmpeg_path = os.path.join(base_path, 'static', 'ffmpeg', 'ffmpeg.exe')
        subprocess.call([ffmpeg_path, "-loglevel", "error",  "-i", video_name, "-filter:v", f"crop={w}:{h}:{x}:{y}", "-c:a", "copy",output_name])

        os.remove(video_name)
        shutil.move(output_name, video_name)
        patient_data.file = video_name
        patient_data.save()


        
        return Response(serializer.data, 200)





