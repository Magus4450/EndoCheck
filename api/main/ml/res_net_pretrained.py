from torch import nn
from torchvision.models import resnet50


def ResNet50Pretrained(n_classes):
    model = resnet50()
    model.fc = nn.Sequential(
        nn.Linear(2048 ,1024),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(1024, 512),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(512, n_classes)
    )
    for name, param in model.named_parameters():
        if 'layer1' in name or 'layer2' in name or 'conv1' in name or 'bn1' in name:
            param.requires_grad=False
    return model


