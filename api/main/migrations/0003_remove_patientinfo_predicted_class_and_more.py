# Generated by Django 4.1.5 on 2023-02-19 10:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_rename_predicted_probas_modeloutput_predicted_probas_normal_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patientinfo',
            name='predicted_class',
        ),
        migrations.RemoveField(
            model_name='patientinfo',
            name='predicted_probas',
        ),
    ]
