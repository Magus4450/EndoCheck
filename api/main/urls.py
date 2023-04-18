from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import views

urlpatterns = [
    path('patient-list', views.PatientListAPIView.as_view(), name='patient-list'),
    path('patient-info', views.PatientInfoAPIView.as_view(), name='patient-info'),
    path('patient-info/<int:id>', views.PatientInfoAPIView.as_view(), name='patient-info-get'),
    path('patient-destroy/<int:id>', views.PatientDestroyAPIView.as_view(), name='patient-destroy'),
    path('video-to-image', views.VideoToImageAPIView.as_view(), name='video-to-image'),
    path('resize-images', views.ImageResizeAPIView.as_view(), name='resize-images'),
    path('predict', views.PredictAPIView.as_view(), name='predict'),
    path('crop', views.VideoCropAPIView.as_view(), name='crop'),
]



urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)  

