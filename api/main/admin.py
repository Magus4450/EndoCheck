from django.contrib import admin

from .models import ModelOutput, PatientInfo

# Register your models here.

admin.site.register(PatientInfo)
admin.site.register(ModelOutput)

