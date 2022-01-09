import os
import torch
import copy
from tqdm import tqdm_notebook
from torchvision.transforms.functional import to_pil_image
import matplotlib.pylab as plt
from tqdm import tqdm_notebook
from torch.utils.data import Dataset, DataLoader, Subset
import glob
from PIL import Image
import torch
import numpy as np
import random
import torchvision.transforms as transforms
import cv2
import numpy as np
from torchvision import models
from torch import nn
import matplotlib.pyplot as plt

def get_frames(filename, n_frames= 1):
    frames = []
    v_cap = cv2.VideoCapture(filename)
    v_len = int(v_cap.get(cv2.CAP_PROP_FRAME_COUNT)) #cv2.CAP_PROP_FRAME_COUNT counts the tot. no. of frames in a video
    frame_list= np.linspace(0, v_len-1, n_frames+1, dtype=np.int16) #np.linspace returns evenly spaced numbers over a specified interval- numpy.linspace(start, stop, num=no. of nos. to generate, endpoint=True, retstep=False, dtype=None, axis=0)
                                                                                                                                                #both start and stop included
    for fn in range(v_len):
        success, frame = v_cap.read() #Reading ( cam. read() ) from a VideoCapture returns a tuple (return value, image) . With the first item you check whether the reading was successful, and if it was then you proceed to use the returned image .
        if success is False:
            continue
        if (fn in frame_list):
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)  
            frames.append(frame)
    v_cap.release() #When you call cap. release() , then: release software resource. release hardware resource
    return frames, v_len

def store_frames(frames, path2store):
    for ii, frame in enumerate(frames): #Enumerate() method adds a counter to an iterable and returns it in a form of enumerating object
        frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)  
        path2img = os.path.join(path2store, "frame"+str(ii)+".jpg")
        cv2.imwrite(path2img, frame)

np.random.seed(2020)
random.seed(2020)
torch.manual_seed(2020)

class VideoDataset(Dataset):
    def __init__(self, ids, transform, num_frames):      
        self.transform = transform
        self.ids = ids
        self.num_frames = num_frames
        #self.labels = labels
    def __len__(self):
        return len(self.ids)
    def __getitem__(self, idx):
        path2imgs=glob.glob(self.ids[idx]+"/*.jpg")
        path2imgs = path2imgs[:self.num_frames]
        #label = labels_dict[self.labels[idx]]
        frames = []
        for p2i in path2imgs:
            frame = Image.open(p2i)
            frames.append(frame)
        
        seed = np.random.randint(1e9)        
        frames_tr = []
        for frame in frames:
            random.seed(seed)
            np.random.seed(seed)
            frame = self.transform(frame)
            frames_tr.append(frame)
        if len(frames_tr)>0:
            frames_tr = torch.stack(frames_tr)
        return frames_tr


h, w = 112, 112
mean = [0.43216, 0.394666, 0.37645]
std = [0.22803, 0.22145, 0.216989]

train_transformer = transforms.Compose([
            transforms.Resize((h,w)),
            transforms.RandomHorizontalFlip(p=0.5),  
            transforms.RandomAffine(degrees=0, translate=(0.1,0.1)),    
            transforms.ToTensor(),
            transforms.Normalize(mean, std),
            ])    

def prediction(path):

    frames, vlen = get_frames(path, n_frames=16)
    os.makedirs("public/frames", exist_ok= True)
    store_frames(frames, "public/frames")
    train_ds = VideoDataset(ids= ["public/frames"], transform= train_transformer, num_frames=16)
    train_dl = DataLoader(train_ds, batch_size = 1, shuffle=True)


    model = models.video.r3d_18(pretrained=True, progress=False)
    num_features = model.fc.in_features
    model.fc = nn.Linear(num_features, 2)
    
    model.load_state_dict(torch.load("public/data/weights_3dcnn.pt",  map_location=torch.device('cpu')))

    for img in train_dl:
        out = model(img.permute(0,2,1,3,4))

    pred = torch.argmax(out, dim = 1)
    print("inside pred", pred)
    if int(pred) == 0:
        return False
    else:
        return True

def prediction_graph(path):

    frames, vlen = get_frames(path, n_frames=50)
    os.makedirs("public/long_frames", exist_ok= True)
    store_frames(frames, "public/long_frames")
    train_ds = VideoDataset(ids= ["public/long_frames"], transform= train_transformer, num_frames=50)
    train_dl = DataLoader(train_ds, batch_size = 1, shuffle=True)


    model = models.video.r3d_18(pretrained=True, progress=False)
    num_features = model.fc.in_features
    model.fc = nn.Linear(num_features, 2)
    
    model.load_state_dict(torch.load("public/data/weights_3dcnn.pt",  map_location=torch.device('cpu')))

    probs = []
    for img in train_dl:
        for i in range(50):
            out = model(img[:,i].unsqueeze(1).permute(0,2,1,3,4))
            probs.append(float(out[:,1]/(out[:,1]+out[:,0])))
    return probs