import os

import cv2
from django.conf import settings
from PIL import Image


def convert_to_size(image_path: str):
    """Converts image to size 224x224"""
    image = Image.open(image_path)
    image = image.resize((224, 224))
    image.save(image_path)

def convert_video_to_image(video_path:str):

    BASE_PATH = settings.BASE_DIR

    preprocess_path = os.path.join(BASE_PATH, "media/preprocessed")
    if not os.path.exists(preprocess_path):
        os.mkdir(preprocess_path)

    file_name = os.path.basename(video_path)
    preprocess_file_path = os.path.join(preprocess_path, file_name)
    if not os.path.exists(preprocess_file_path):
        os.mkdir(preprocess_file_path)

    vidcap = cv2.VideoCapture(video_path)
    success, image = vidcap.read()
    count = 0

    while success:
        path = os.path.join(preprocess_file_path, f"{count}.jpg")
        print(path)
        cv2.imwrite(path, image)     # save frame as JPEG file
        success, image = vidcap.read()
        count += 1

    return f"media/preprocessed/{file_name}", count
