
import os

import torch
import torch.nn.functional as nnf
from data_loader import DataLoader
from grad_cam import GradCamModel
from resnet import ResNet50

from . import conf as cfg


class ResNetPredictor:

    def __init__(self, model_weights_path:str, data_loader: DataLoader):
        self.class_bin = cfg.class_bin
        self.classes_multi = cfg.classes_multi
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self._load_model(model_weights_path)
        self.data_loader = data_loader

    def _load_model(self, model_weights_path):
        r50 = ResNet50(img_channels=3, num_classes=14, cam=False).to(self.device)
        r50.load_state_dict(torch.load(model_weights_path))

        return r50
    
    def predict(self):

        self.model.eval()
        pred_proba_lst = []
        pred_class_lst =  []
        
        for image in self.data_loader:
            image = image.to(self.device)
            out = self.model(image)
            proba = nnf.softmax(out, dim=1)
            proba = [format(p*100,'.2f') for p in proba.cpu().detach().numpy()[0]]
            pred_proba_lst.append(proba)
            idx = torch.argmax(proba, dim=1).cpu().numpy()[0]
            class_ = self.classes_multi[idx]
            pred_class_lst.append(class_)



        
        pass
        


    

    
# def predict(model, image_path:str):

#     transform = transforms.Compose([
#         transforms.ToPILImage(),
#         transforms.Resize((224, 224)),
#         transforms.ToTensor(),
#     ])
#     image = imread(image_path)

#     image = transform(image)

#     model.eval()

#     out = model(image.unsqueeze(0))
#     proba = nnf.softmax(out, dim=1)
#     proba = [format(p*100,'.2f') for p in proba.cpu().detach().numpy()[0]]
#     idx = torch.argmax(proba, dim=1).cpu().numpy()[0]
#     class_ = classes_multi[idx]

#     print(class_, proba)