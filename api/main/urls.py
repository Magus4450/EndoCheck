from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import views

urlpatterns = [
    path('ping', views.ping, name='ping'),
    path('patient-info', views.PatientInfoAPIView.as_view(), name='patient-info'),
    path('patient-info/<int:id>', views.PatientInfoAPIView.as_view(), name='patient-info-get'),
    path('video-to-image', views.VideoToImageAPIView.as_view(), name='video-to-image'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


