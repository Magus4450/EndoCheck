from torch import nn


class ResBlock(nn.Module):
    def __init__(self, in_channels: int, out_channels: int, identity_downsample: nn.Sequential = None, stride:int = 1) -> None:
        super(ResBlock, self).__init__()
        self.expansion = 4
        self.conv1 = nn.Conv2d(in_channels, out_channels, kernel_size=1, stride=1, padding=0)
        self.bn1 = nn.BatchNorm2d(out_channels)
        self.conv2 = nn.Conv2d(out_channels, out_channels, kernel_size=3, stride=stride, padding=1)
        self.bn2 = nn.BatchNorm2d(out_channels)
        self.conv3 = nn.Conv2d(out_channels, out_channels * self.expansion, kernel_size=1, stride=1, padding=0)
        self.bn3= nn.BatchNorm2d(out_channels*self.expansion)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.1)
        self.identity_downsample = identity_downsample

    def forward(self, x):
        indentity = x
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.dropout(x)
        x = self.conv2(x)
        x = self.bn2(x)
        x = self.relu(x)
        x = self.dropout(x)
        x = self.conv3(x)
        x = self.bn3(x)

        if self.identity_downsample is not None:
            indentity = self.identity_downsample(indentity)
        
        x += indentity
        x = self.relu(x)
        return x

    
class ResNet(nn.Module):
    def __init__(self, resblock: ResBlock, layers: list[int], image_channels: int, num_classes: int) -> None:
        super(ResNet, self).__init__()
        self.in_channels = 64
        self.conv1 = nn.Conv2d(image_channels, 64, kernel_size=7, stride=2, padding=3)
        self.bn1 = nn.BatchNorm2d(64)
        self.relu = nn.ReLU()
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)

        # ResNet layers

        self.layer1 = self._make_layer(resblock, layers[0], out_channels=64, stride=1)
        self.layer2 = self._make_layer(resblock, layers[1], out_channels=128, stride=2)
        self.layer3 = self._make_layer(resblock, layers[2], out_channels=256, stride=2)
        self.layer4 = self._make_layer(resblock, layers[3], out_channels=512, stride=2)

        self.avgpool = nn.AdaptiveAvgPool2d((1,1))
        self.fc = nn.Linear(512*4, num_classes)

    def _make_layer(self, resblock, num_residual_blocks, out_channels, stride):
        identity_downsample = None
        layers = []

        if stride != 1 or self.in_channels != out_channels * 4:
            identity_downsample = nn.Sequential(nn.Conv2d(self.in_channels, out_channels*4, kernel_size=1, stride=stride),
                                                nn.BatchNorm2d(out_channels*4))
        
        layers.append(resblock(self.in_channels, out_channels, identity_downsample, stride))
        self.in_channels = out_channels * 4

        for i in range(num_residual_blocks - 1):
            layers.append(resblock(self.in_channels, out_channels))

        return nn.Sequential(*layers)

    def forward(self, x):
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.maxpool(x)

        x = self.layer1(x)
        x = self.layer2(x)
        x = self.layer3(x)
        x = self.layer4(x)

        x = self.avgpool(x)
        x = x.reshape(x.shape[0], -1)
        x = self.fc(x)

        return x

from torch.nn import functional as F


class Net(nn.Module):
    def __init__(self, n_classes):
        super(Net,self).__init__() 
        #img = images
        self.fc=nn.Linear(2048,n_classes)

    
    def forward(self,x):     
        x=x.view(2048,7*7).mean(1).view(1,-1)
        x=self.fc(x)
        return  F.softmax(x,dim=1)


def ResNet50(img_channels, num_classes, cam=False):
    model = ResNet(ResBlock, [3, 4, 6, 3], img_channels, num_classes)
    if cam:
        mod = nn.Sequential(*list(model.children())[:-2])
        model = nn.Sequential(mod, Net(num_classes))

    return model

