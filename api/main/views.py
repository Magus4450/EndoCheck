import os

from django.templatetags.static import static
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import serializers
from .ml import preprocesing
from .ml.data_loader import DataLoader
from .ml.predictor import ResNetPredictor
from .models import PatientInfo


@api_view(['GET'])
def ping(request):
    return Response({'message': 'pong'}, 200)

@api_view(['GET'])
def test(request):
    dl = DataLoader('media/preprocessed/2.mp4', batch_size = 32, is_folder=True)
    for i in dl:
        print(i.shape)
    return Response({'message': 'test'}, 200)

@api_view(['GET'])
def test_model(request):
    model_weight_path = 'static/weights/resnet_multi_100_dropout1.pth'
    dl = DataLoader('media/preprocessed/test2.mp4', batch_size = 32, is_folder=True)

    rnp = ResNetPredictor(
        model_weights_path=model_weight_path,
        data_loader=dl)
    pred_class, pred_proba = rnp.predict()
    

    return Response({
        'pred_class': pred_class,
        'pred_proba': pred_proba
    }, 200)


class PatientInfoAPIView(generics.GenericAPIView):

    serializer_class = serializers.PatientInfoSerializer
    lookup_field = 'id'
    def post(self, request):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, 200)
    
    # Get for one pk
    def get(self, request, id):
        patient_data = PatientInfo.objects.get(id=id)
        serializer = self.get_serializer(patient_data)
        out_data = serializer.data
        preprocessed_file_path = patient_data.preprocessed_file_path
        host = request.get_host()
        host_path = "/".join([host, preprocessed_file_path])
        out_data['preprocessed_file_path'] = host_path
        return Response(out_data, 200)


class VideoToImageAPIView(generics.GenericAPIView):

    serializer_class = serializers.VideoToImageSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        patient_id = serializer.validated_data['patient_id']

        patient_data = PatientInfo.objects.get(id=patient_id)

        file_path = patient_data.file.path
        print(file_path)

        folder_path, count = preprocesing.convert_video_to_image(file_path)

       
       
        patient_data.preprocessed_file_path = folder_path
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

        if file_type == 'image':
            file_path = patient_data.file.path
            preprocesing.convert_to_size(file_path)
        else:
            folder_path = patient_data.preprocessed_file_path
            num_files = patient_data.preprocessed_file_number

            for i in range(num_files):
                file_name = f'{i}.jpg'
                file_path = os.path.join(folder_path, file_name)
                preprocesing.convert_to_size(file_path)
       
        return Response(serializer.data, 200)




    







