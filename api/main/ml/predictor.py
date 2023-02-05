
import os

import numpy as np
import torch
import torch.nn.functional as nnf
from tqdm import tqdm

from . import conf as cfg
from .data_loader import DataLoader
from .grad_cam import GradCamModel
from .resnet import ResNet50


class ResNetPredictor:

    def __init__(self, model_weights_path:str, data_loader: DataLoader):
        self.class_bin = cfg.class_bin
        self.classes_multi = cfg.classes_multi
        self.mapping = cfg.mapping
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self._load_model(model_weights_path)
        self.data_loader = data_loader

    def _load_model(self, model_weights_path):
        r50 = ResNet50(img_channels=3, num_classes=14, cam=False).to(self.device)
        r50.load_state_dict(torch.load(model_weights_path, map_location=self.device))

        return r50
    
    def _get_gradcam(self):
        
        pass
    
    def _predict(self):

        self.model.eval()
        pred_proba_lst = []
        pred_class_lst =  []
        # Increase tqdm by batch size each step
        for image in tqdm(self.data_loader, total=len(self.data_loader)//self.data_loader.batch_size):
            image = image.to(self.device)
            cur_batch_size = image.shape[0]

            out = self.model(image)
            proba = nnf.softmax(out, dim=1)

            

            if cur_batch_size > 1:
                idx = torch.argmax(proba, dim=1).cpu().numpy()
                for i in idx:
                    class_ = self.classes_multi[i]
                    pred_class_lst.append(class_)
                
                for proba_one in proba.cpu().detach().numpy():
                    proba_lst = [format(p*100,'.2f') for p in proba_one]
                    pred_proba_lst.append(proba_lst)
            else:
                idx = torch.argmax(proba, dim=1).cpu().numpy()[0]
                class_ = self.classes_multi[idx]
                proba_lst = [format(p*100,'.2f') for p in proba.cpu().detach().numpy()[0]]
                pred_class_lst.append(class_)
                pred_proba_lst.append(proba_lst)

            
        # Return np array in multi class prediction
        return np.array(pred_class_lst), np.array(pred_proba_lst)
    
    def predict(self):

        m_pred_class, m_pred_proba = self._predict()

        b_pred_class = []

        for class_ in m_pred_class:
            b_pred_class.append(self.mapping[class_])
        
        return np.array(b_pred_class), m_pred_proba




    

    
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

#     print(class_, proba)#     print(class_, proba)