import os
import glob
import torch
import numpy as np
import pydicom
import cv2
from monai.networks.nets import DenseNet121
from torchvision.transforms import functional as TF
import random

IMG_SIZE = 256
NUM_SLICES = 64
modalities = ['FLAIR', 'T1w', 'T1wCE', 'T2w']
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_dicom_volume(folder):
    files = sorted(glob.glob(folder + '/*.dcm'))
    if len(files) == 0:
        raise Exception(f"No DICOM files in {folder}")
    if len(files) >= NUM_SLICES:
        step = len(files) // NUM_SLICES
        files = files[::step][:NUM_SLICES]
    else:
        files += [files[-1]] * (NUM_SLICES - len(files))
    volume = [cv2.resize(pydicom.dcmread(f).pixel_array, (IMG_SIZE, IMG_SIZE)) for f in files]
    volume = np.stack(volume).astype(np.float32)
    volume = (volume - volume.min()) / (volume.max() + 1e-5)
    return volume

def load_multimodal_tensor(folder):
    all_volumes = []
    for mod in modalities:
        path = os.path.join(folder, mod)
        vol = load_dicom_volume(path)
        all_volumes.append(vol)
    stacked = np.stack(all_volumes)  # (4, D, H, W)
    return torch.tensor(stacked).unsqueeze(0).float()  # (1, 4, D, H, W)

def augment(img):
    # Ensure img is in the correct shape [batch_size, channels, height, width]
    if img.dim() == 4:  # If img is [batch_size, channels, height, width]
        if random.random() > 0.5:
            img = torch.flip(img, dims=[3])
        if random.random() > 0.5:
            img = torch.flip(img, dims=[4])
        if random.random() > 0.5:
            img = TF.rotate(img, angle=random.choice([90, 180, 270]))
    return img

def predict_patient_folder(patient_path):
    # Corrected model paths to be relative to the script's location (backend directory)
    model_paths = [f'best_model_fold{i}.pth' for i in range(1, 6)]
    img = load_multimodal_tensor(patient_path).to(device)

    votes = []
    probs = []

    for path in model_paths:
        model = DenseNet121(spatial_dims=3, in_channels=4, out_channels=2).to(device)
        model.load_state_dict(torch.load(path, map_location=device))
        model.eval()
        with torch.no_grad():
            fold_probs = []
            for _ in range(3):
                x_aug = augment(img.clone())
                out = model(x_aug)
                prob = torch.softmax(out, dim=1)[0][1].item()
                fold_probs.append(prob)
                votes.append(int(prob > 0.5))
            probs.append(np.mean(fold_probs))

    final_pred = int(np.mean(votes) > 0.5)
    final_prob = np.mean(probs)
    return final_pred, final_prob
