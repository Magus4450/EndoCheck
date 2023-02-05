from rest_framework import serializers

from .models import PatientInfo


class PatientInfoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PatientInfo
        fields = ('id', 'patients_name', 'patients_age', 'file_type', 'file', 'date', 'preprocessed_file_path', 'preprocessed_file_number', 'predicted_class', 'predicted_probas', 'grad_images')
        extra_kwargs = {
            'id': {'read_only': True},
            'file_type': {'read_only': True},
            'date': {'read_only': True},
            'preprocessed_file_path': {'read_only': True},
            'preprocessed_file_number': {'read_only': True},
            'predicted_class': {'read_only': True},
            'predicted_probas': {'read_only': True},
            'grad_images': {'read_only': True}
        }

    
    def create(self, validated_data):

        p_info = PatientInfo.objects.create(
            patients_name=validated_data['patients_name'],
            patients_age=validated_data['patients_age'],
            file_type=validated_data['file_type'],
            file=validated_data['file']

        )
        p_info.save()
        return p_info

    def validate(self, attrs):
        ft = attrs['file'].content_type.split('/')[0]
        extension = attrs['file'].name.split('.')[-1]

        if ft not in ['image', 'video']:
            raise serializers.ValidationError('File type not supported')
        
        if ft == 'image' and extension not in ['jpg', 'jpeg', 'png']:
            raise serializers.ValidationError('Image type not supported')   
        
        if ft == 'video' and extension not in ['mp4', 'mkv']:
            raise serializers.ValidationError('Video type not supported')

        attrs['file_type'] = ft
        return super().validate(attrs)
    


    def validate_patients_age(self, value):
        if value < 0 or value > 120:
            raise serializers.ValidationError('Age not valid')
        return value
    
    def validate_patients_name(self, value):
        if len(value) < 3 or len(value) > 100:
            raise serializers.ValidationError('Name not valid')
        return value

class VideoToImageSerializer(serializers.Serializer):
    patient_id  = serializers.IntegerField()

    def validate_patient_id(self, value):
        
        if not PatientInfo.objects.filter(id=value).exists():
            raise serializers.ValidationError('Patient does not exist')

        patient_data = PatientInfo.objects.get(id=value)
        if patient_data.file_type != 'video':
            raise serializers.ValidationError('Patient does not have a video file')
        return value

class ImageResizeSerializer(serializers.Serializer):
    patient_id  = serializers.IntegerField()

    def validate_patient_id(self, value):
        
        if not PatientInfo.objects.filter(id=value).exists():
            raise serializers.ValidationError('Patient does not exist')
        return value

class PredictSerializer(serializers.Serializer):
    patient_id  = serializers.IntegerField()

    def validate_patient_id(self, value):
        
        if not PatientInfo.objects.filter(id=value).exists():
            raise serializers.ValidationError('Patient does not exist')
        return value
    