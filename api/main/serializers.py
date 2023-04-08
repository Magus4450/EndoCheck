from rest_framework import serializers

from .models import ModelOutput, PatientInfo


class PatientInfoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PatientInfo
        fields = ('id', 'name', 'patients_age', 'detail','file_type', 'file', 'date', 'preprocessed_file_path', 'preprocessed_file_number', 'grad_images')
        extra_kwargs = {
            'id': {'read_only': True},
            'file_type': {'read_only': True},
            'date': {'read_only': True},
            'preprocessed_file_path': {'read_only': True},
            'preprocessed_file_number': {'read_only': True},
            'grad_images': {'read_only': True}
        }

    
    def create(self, validated_data):
        f = validated_data['file']
        if validated_data['extension'] not in f.name:
            validated_data['file'].name = f.name + validated_data['extension']
        p_info = PatientInfo.objects.create(
            name=validated_data['name'],
            patients_age=validated_data['patients_age'],
            detail=validated_data['detail'],
            file_type=validated_data['file_type'],
            file=f

        )
        p_info.save()
        return p_info

    def validate(self, attrs):
        ft = attrs['file'].content_type.split('/')[0]
        extension = attrs['file'].content_type.split('/')[-1]

       

        if ft not in ['image', 'video']:
            raise serializers.ValidationError('File type not supported')
        
        if ft == 'image' and extension not in ['jpg', 'jpeg', 'png']:
            raise serializers.ValidationError('Image type not supported')   
        
        if ft == 'video' and extension not in ['mp4', 'mkv']:
            raise serializers.ValidationError('Video type not supported')

        attrs['file_type'] = ft
        attrs['extension'] = f'.{extension}'
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


class VideoCropSerializer(serializers.Serializer):
    patient_id = serializers.IntegerField()
    x = serializers.CharField()
    y = serializers.CharField()
    w = serializers.CharField()
    h = serializers.CharField()

    def validate(self, attrs):
        
        if not PatientInfo.objects.filter(id=attrs['patient_id']).exists():
            raise serializers.ValidationError('Patient does not exist')
        return super().validate(attrs)


    
        
class ModelOutputSerializer(serializers.ModelSerializer):

    class Meta:
        model = ModelOutput
        fields = ('patient', 'file_number', 'predicted_class', 'predicted_probas_normal', 'predicted_probas_pathological')
    


