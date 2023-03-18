DEBUG = True

ALLOWED_HOSTS = []
CORS_ORIGIN_ALLOW_ALL = True

MEDIA_ROOT = 'media/'
MEDIA_URL = '/media/'

STATIC_ROOT = 'static/'
STATIC_URL = '/static/'

PREPROCESSED_PATH = f"{MEDIA_ROOT}/preprocessed"
GRAD_CAM_PATH = f"{MEDIA_ROOT}/grad_cam"
OVERLAYED_PATH = f"{MEDIA_ROOT}/overlayed_images"
RAW_PATH = f"{MEDIA_ROOT}/raw"
TEMP_PATH = f"{MEDIA_ROOT}/tmp"

IMAGE_FORMAT = "png"

# Number of frames to extract from second of video
FRAME_PER_SEC = 1

ML_MODEL_WEIGHT = "resnet_multi_pre_100_moretransforms.pth"
ML_MODEL_PATH = f"{STATIC_ROOT}/weights/{ML_MODEL_WEIGHT}"
ML_IMG_SIZE = (336, 336)
ML_DEVICE = "cpu" # "cuda"
ML_BATCH_SIZE = 32