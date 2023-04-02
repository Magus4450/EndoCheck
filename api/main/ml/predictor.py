
import os

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as nnf
from django.conf import settings
from scipy.ndimage.filters import gaussian_filter
from skimage.transform import resize
from tqdm import tqdm

from . import conf as cfg
from .data_loader import DataLoader
from .grad_cam import GradCamModel
from .res_net_pretrained import ResNet50Pretrained, ResNet50PretrainedLessFC
from .resnet import ResNet50

# Do not use GUI backend
plt.switch_backend('agg')



class ResNetPredictor:

    def __init__(self, model_weights_path:str, data_loader: DataLoader):
        self.class_bin = cfg.class_bin
        self.classes_multi = cfg.classes_multi
        self.mapping = cfg.mapping
        self.mapping_cls = cfg.mapping_cls
        self.device = torch.device(settings.ML_DEVICE)
        self.model, self.grad_model = self._load_models(model_weights_path)
        self.data_loader = data_loader
        self.samples_per_class = cfg.samples_per_class
        self.grad_cam_path , self.overlayed_img_path = self._configure_paths()

    
    def _configure_paths(self):
        grad_cam_path = os.path.join(settings.BASE_DIR, settings.GRAD_CAM_PATH)
        if not os.path.exists(grad_cam_path):
            os.mkdir(grad_cam_path)
        overlayed_img_path = os.path.join(settings.BASE_DIR, settings.OVERLAYED_PATH)
        if not os.path.exists(overlayed_img_path):
            os.mkdir(overlayed_img_path)

        return grad_cam_path, overlayed_img_path

    def _load_models(self, model_weights_path):

        r50 = ResNet50PretrainedLessFC(n_classes=14).to(self.device)
        
        r50.load_state_dict(torch.load(model_weights_path, map_location=self.device))

        grad_cam = GradCamModel(r50)

        return r50, grad_cam
    
    def _get_one_gradcam(self, image):
        print(f"GC: Setting grad model to eval")
        print(f"GC: image:{image.shape} image-max:{image.max()}")
        self.grad_model.eval()
        out, acts = self.grad_model(image)
        acts = acts.detach().cpu()
        class_weights = {}
        sum_ = sum(self.samples_per_class.values())
        for key, value in self.samples_per_class.items():
            class_weights[self.classes_multi.index(key)] = sum_ / (14 * value)

        loss = nn.CrossEntropyLoss(weight = torch.tensor(list(class_weights.values())).to(self.device))(out, torch.tensor([0]).to(self.device)).to(self.device)

        loss.backward()
        grads = self.grad_model.get_act_grads().detach().cpu()
        pooled_grads = torch.mean(grads, dim=[0,2,3]).detach().cpu()
        for i in range(acts.shape[1]):
            acts[:,i,:,:] += pooled_grads[i]  
            
        heatmap_j = torch.mean(acts, dim = 1).squeeze()
        print(f"GC: heatmap_j:{heatmap_j.shape} heatmap_j-max:{heatmap_j.max()}")
        heatmap_j_max = heatmap_j.max(axis = 0)[0]
        heatmap_j /= heatmap_j_max
        print(f"GC: heatmap_j:{heatmap_j.shape} heatmap_j-max:{heatmap_j.max()}")
        heatmap_j = resize(heatmap_j.cpu().numpy(),settings.ML_IMG_SIZE,preserve_range=True)
        print(f"GC: heatmap_j:{heatmap_j.shape} heatmap_j-max:{heatmap_j.max()}")
        heatmap_j = gaussian_filter(heatmap_j, sigma=10)
        cmap = mpl.cm.get_cmap('turbo',256)
        heatmap_j2 = cmap(heatmap_j,alpha = 1) 
        heatmap_j3 = cmap(heatmap_j, alpha=0.2)
        print(heatmap_j2.shape)
        # print(type(heatmap_j)) 
        # print(type(heatmap_j2))
        

        return image.squeeze().permute(1,2,0).cpu().numpy(), heatmap_j2, heatmap_j3
        




    def get_gradcam(self):
        
        print('GC: Generating GradCam images')

        print("GC: Configuring base paths")
        base_name = os.path.basename(self.data_loader.data_path)
        grad_out_base_path = os.path.join(self.grad_cam_path, base_name)
        overlayed_out_base_path = os.path.join(self.overlayed_img_path, base_name)
        if not os.path.exists(grad_out_base_path):
            os.mkdir(grad_out_base_path)
        if not os.path.exists(overlayed_out_base_path):
            os.mkdir(overlayed_out_base_path)
        
        print("GC: Looping through images required Grad-CAMs")
        for i ,image in enumerate(self.data_loader(for_grad=True)):
            print(f"GC: i:{i} image:{image.shape} image-max:{image.max()}")
            grad_final_path = os.path.join(grad_out_base_path, f'{i}.{settings.IMAGE_FORMAT}')
            overlayed_final_path = os.path.join(overlayed_out_base_path, f'{i}.{settings.IMAGE_FORMAT}')
            print(f"GC: Getting {i+1}th gradcam")
            img, heatmap, overlay = self._get_one_gradcam(image)
            
            print(f"GC: Saving {i+1}th gradcam")
            self._save_grad_image(heatmap, grad_final_path)
            print(f"GC: Saving {i+1}th overlay")
            self._save_overlayed_image(img, overlay, overlayed_final_path)
            

        print('GradCam images generated')
        return grad_out_base_path, overlayed_out_base_path
            


    def _save_grad_image(self, img, path):
        px = 1/plt.rcParams['figure.dpi']  # pixel in inches
        fig = plt.figure(figsize = (291*px,291*px))
        ax = fig.add_subplot(111)
        ax.imshow(img, cmap = 'jet')
        plt.axis('off')
        plt.tick_params(axis='both', left=False, top=False, right=False, bottom=False, labelleft=False, labeltop=False, labelright=False, labelbottom=False)
        plt.savefig(path, bbox_inches='tight', pad_inches=0.0)
        plt.close()

    def _save_overlayed_image(self, img, overlay, path):
        print("Img", img.shape)
        print("Overlay", overlay.shape)
        px = 1/plt.rcParams['figure.dpi']  # pixel in inches
        fig = plt.figure(figsize = (291*px,291*px))
        ax = fig.add_subplot(111)
        # cmap = mpl.cm.get_cmap('jet',256)
        # overlay = cmap(overlay,alpha = 0.2)
        print("Img", img.shape)
        print("Overlay", overlay.shape)
        ax.imshow(img)
        ax.imshow(overlay)
        plt.axis('off')
        plt.tick_params(axis='both', left=False, top=False, right=False, bottom=False, labelleft=False, labeltop=False, labelright=False, labelbottom=False)
        plt.savefig(path, bbox_inches='tight', pad_inches=0.0)
        plt.close()

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
            print(proba)

            

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

        # Seperate predicted probas into normal probas and pathological probas
        normal_pred_proba_lst = []
        patho_pred_proba_lst = []

        for proba in pred_proba_lst:
            normals = []
            pathos = []
            for i, p in enumerate(proba):
                if self.mapping_cls[i] == "Normal":
                    normals.append(p)
                else:
                    pathos.append(p)
            normal_pred_proba_lst.append(normals)
            patho_pred_proba_lst.append(pathos)
                

        return pred_class_lst,normal_pred_proba_lst, patho_pred_proba_lst
    
    def predict(self):

        print("Predicting...")
        m_pred_class, normal_pred_proba_lst, patho_pred_proba_lst = self._predict()
        print("Predicting done")
        b_pred_class = []

        for class_ in m_pred_class:
            b_pred_class.append(self.mapping[class_])
        
        return b_pred_class,  normal_pred_proba_lst, patho_pred_proba_lst




