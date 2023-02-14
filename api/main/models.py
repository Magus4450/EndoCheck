from django.db import models

CHOICES = (
    ('image', 'image'),
    ('video', 'video'),
)

class PatientInfo(models.Model):

    first_name = models.CharField(max_length=100, default='Test')
    last_name = models.CharField(max_length=100, default='Test')
    patients_age = models.IntegerField(default = '999')
    file_type = models.CharField(max_length=100, choices=CHOICES, default='image')
    file = models.FileField(upload_to='raw/', default='media/endoscopy/FDD.png')
    date = models.DateTimeField(auto_now_add=True)

    preprocessed_file_path = models.CharField(max_length=100, blank=True, null=True)
    preprocessed_file_number = models.IntegerField(blank=True, null=True)

    predicted_class = models.CharField(max_length=100, blank=True, null=True)
    predicted_probas = models.CharField(max_length=100, blank=True, null=True)
    
    grad_images = models.CharField(max_length=100, blank=True, null=True)
    overlayed_images = models.CharField(max_length=100, blank=True, null=True)
    


    def __str__(self):
        return self.first_name +  " " + self.last_name
