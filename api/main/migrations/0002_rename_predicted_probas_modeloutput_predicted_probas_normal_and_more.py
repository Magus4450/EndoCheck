# Generated by Django 4.1.5 on 2023-02-19 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='modeloutput',
            old_name='predicted_probas',
            new_name='predicted_probas_normal',
        ),
        migrations.AddField(
            model_name='modeloutput',
            name='predicted_probas_pathological',
            field=models.CharField(default='test', max_length=500),
            preserve_default=False,
        ),
    ]
