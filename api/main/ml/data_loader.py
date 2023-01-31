import os

from django.conf import settings
from skimage.io import imread
from torchvision import transforms


class DataLoader:

    def __init__(self, data_path:str, is_folder:bool = False):
        self.is_folder = is_folder
        self.data_path = data_path if not is_folder else os.path.join(settings.BASE_DIR, data_path)
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
        ])
    
    def __iter__(self):
        if self.is_folder:
            for image in os.listdir(self.data_path):
                image_path = os.path.join(self.data_path, image)
                image = imread(image_path)
                image = self.transform(image)
                image = image.unsqueeze(0)
                yield image
        else:
            image = imread(self.data_path)
            image = self.transform(image)
            image = image.unsqueeze(0)
            yield image

    def __len__(self):
        if self.is_folder:
            return len(os.listdir(self.data_path))
        else:
            return 1
    