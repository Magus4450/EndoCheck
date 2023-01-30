from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import preprocesing, serializers
from .models import PatientInfo


@api_view(['GET'])
def ping(request):
    return Response({'message': 'pong'}, 200)



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
        return Response(serializer.data, 200)


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

       
       
        patient_data.preprocessed_file_path = request.build_absolute_uri(folder_path)
        patient_data.preprocessed_file_number = count
        patient_data.save()






        return Response(serializer.data, 200)


    





