from django.db import models

CHOICES = (
    ('image', 'image'),
    ('video', 'video'),
)

class PatientInfo(models.Model):

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    patients_age = models.IntegerField()
    other_details = models.CharField(max_length=200, blank=True, null=True)
    file_type = models.CharField(max_length=100, choices=CHOICES)
    file = models.FileField(upload_to='raw/')
    date = models.DateTimeField(auto_now_add=True)

    preprocessed_file_path = models.CharField(max_length=100, blank=True, null=True)
    preprocessed_file_number = models.IntegerField(blank=True, null=True)

    # predicted_class = models.CharField(max_length=100, blank=True, null=True)
    # predicted_probas = models.CharField(max_length=100, blank=True, null=True)
    
    grad_images = models.CharField(max_length=100, blank=True, null=True)
    overlayed_images = models.CharField(max_length=100, blank=True, null=True)
    


    def __str__(self):
        return self.first_name +  " " + self.last_name


class ModelOutput(models.Model):

    patient = models.ForeignKey(PatientInfo, on_delete=models.CASCADE)
    file_number = models.IntegerField(default=0)
    predicted_class = models.CharField(max_length=100)
    predicted_probas_normal = models.CharField(max_length=500)
    predicted_probas_pathological = models.CharField(max_length=500)



    def __str__(self):
        return self.patient.first_name + "-> " + self.predicted_class