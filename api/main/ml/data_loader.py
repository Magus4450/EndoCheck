import os

import torch
from django.conf import settings
from skimage.io import imread
from torchvision import transforms


class DataLoader:

    def __init__(self, data_path:str,  batch_size:int, is_folder:bool = False):
        self.is_folder = is_folder
        self.batch_size = batch_size
        self.data_path = data_path if not is_folder else os.path.join(settings.BASE_DIR, data_path)
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize(settings.ML_IMG_SIZE),
            transforms.ToTensor(),
        ])
    
    def __iter__(self, for_grad:bool = False):
        if self.is_folder:
            batch_size = 0
            batch = None
            for i, image in enumerate(os.listdir(self.data_path)):
                image_path = os.path.join(self.data_path, f"{i}.{settings.IMAGE_FORMAT}")
                # print(image_path)
                image = imread(image_path)
                image = self.transform(image)
                image = image.unsqueeze(0)
                if for_grad:
                    yield image
                    continue
                if batch is None:
                    batch = image
                else:
                    batch = torch.cat((batch, image), dim=0)
                batch_size += 1
                if batch_size == self.batch_size:
                    yield batch
                    batch_size = 0
                    batch = None
            else:
                if batch_size != 0:
                    yield batch
                
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
    
    def __call__(self, for_grad:bool = False):
        return self.__iter__(for_grad=for_grad)



        