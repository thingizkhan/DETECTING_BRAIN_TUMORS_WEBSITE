import os
import glob
import re
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.nn.functional as F
import cv2
import pydicom
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import StratifiedKFold, train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score
from monai.networks.nets import DenseNet121
from datetime import datetime
from tqdm import tqdm

# Constants
IMG_SIZE = 256
NUM_SLICES = 64
modalities = ['FLAIR', 'T1w', 'T1wCE', 'T2w']
data_directory = 'rsna-miccai-brain-tumor-radiogenomic-classification'
BATCH_SIZE = 8
EPOCHS = 50
FOLDS = 5
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Helpers
def natural_sort(l):
    convert = lambda text: int(text) if text.isdigit() else text.lower()
    alphanum_key = lambda key: [convert(c) for c in re.split('([0-9]+)', key)]
    return sorted(l, key=alphanum_key)

def load_dicom_image(path, img_size=IMG_SIZE):
    try:
        dicom = pydicom.dcmread(path)
        data = dicom.pixel_array
    except:
        return np.zeros((img_size, img_size))
    if np.min(data) == np.max(data):
        return np.zeros((img_size, img_size))
    data = cv2.resize(data, (img_size, img_size))
    return data

def load_dicom_volume(scan_id, mri_type, num_imgs=NUM_SLICES, img_size=IMG_SIZE, split='train'):
    path = f"{data_directory}/{split}/{scan_id}/{mri_type}"
    files = natural_sort(glob.glob(f"{path}/*.dcm"))
    if len(files) == 0:
        raise ValueError(f"No DICOM files found in {path}")
    if len(files) >= num_imgs:
        every_nth = len(files) / num_imgs
        indexes = [int(i * every_nth) for i in range(num_imgs)]
        files = [files[i] for i in indexes]
    else:
        while len(files) < num_imgs:
            files.append(files[-1])
    volume = [load_dicom_image(f, img_size) for f in files]
    volume = np.stack(volume).astype(np.float32)
    volume = (volume - np.min(volume)) / (np.max(volume) + 1e-5)
    return volume

def load_multimodal_volume(scan_id, split='train'):
    volumes = [load_dicom_volume(scan_id, mod, split=split) for mod in modalities]
    img = np.stack(volumes, axis=0)
    return torch.tensor(img).float()

class MultiModalDataset(Dataset):
    def __init__(self, df, split='train'):
        self.df = df.reset_index(drop=True)
        self.split = split

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.loc[idx]
        scan_id = str(row['BraTS21ID']).zfill(5)
        label = int(row['MGMT_value'])
        img = load_multimodal_volume(scan_id, split=self.split)
        return img, torch.tensor(label).long()

class LabeledTestDataset(Dataset):
    def __init__(self, df, split='train'):
        self.df = df.reset_index(drop=True)
        self.split = split

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.loc[idx]
        scan_id = str(row['BraTS21ID']).zfill(5)
        label = int(row['MGMT_value'])
        img = load_multimodal_volume(scan_id, split=self.split)
        return img, label, scan_id

df = pd.read_csv(f"{data_directory}/train_labels.csv").dropna()
train_df, test_df = train_test_split(df, test_size=0.2, stratify=df["MGMT_value"], random_state=42)

for fold, (train_idx, val_idx) in enumerate(StratifiedKFold(n_splits=5, shuffle=True, random_state=42).split(train_df, train_df["MGMT_value"])):
    print(f"\n🧠 Fold {fold+1}/{FOLDS}")
    train_data = train_df.iloc[train_idx]
    val_data = train_df.iloc[val_idx]

    train_ds = MultiModalDataset(train_data)
    val_ds = MultiModalDataset(val_data)

    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False)

    model = DenseNet121(spatial_dims=3, in_channels=4, out_channels=2).to(device)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)
    criterion = nn.CrossEntropyLoss()

    best_auc = 0.0
    model_path = f"best_model_fold{fold+1}.pth"

    for epoch in range(EPOCHS):
        model.train()
        for x, y in train_loader:
            x, y = x.to(device), y.to(device)
            optimizer.zero_grad()
            loss = criterion(model(x), y)
            loss.backward()
            optimizer.step()

        model.eval()
        y_true, y_prob = [], []
        with torch.no_grad():
            for x, y in val_loader:
                x, y = x.to(device), y.to(device)
                out = model(x)
                prob = F.softmax(out, dim=1)[:, 1]
                y_true.extend(y.cpu().numpy())
                y_prob.extend(prob.cpu().numpy())
        val_auc = roc_auc_score(y_true, y_prob)
        print(f"Epoch {epoch+1}/{EPOCHS} - Val AUC: {val_auc:.4f}")
        if val_auc > best_auc:
            best_auc = val_auc
            torch.save(model.state_dict(), model_path)
            print(f"✅ Saved best model to {model_path}")

print("\n🔍 Ensemble Inference on Test Set")
model_paths = [f"best_model_fold{i+1}.pth" for i in range(FOLDS)]
test_dataset = LabeledTestDataset(test_df)
test_loader = DataLoader(test_dataset, batch_size=1, shuffle=False)

all_fold_probs = []

for path in model_paths:
    model = DenseNet121(spatial_dims=3, in_channels=4, out_channels=2).to(device)
    model.load_state_dict(torch.load(path, map_location=device))
    model.eval()
    fold_probs = []

    with torch.no_grad():
        for x, _, _ in tqdm(test_loader):
            x = x.to(device)
            out = model(x)
            prob = F.softmax(out, dim=1).cpu().numpy()
            fold_probs.append(prob)

    all_fold_probs.append(fold_probs)

all_fold_probs = np.array(all_fold_probs)
avg_probs = np.mean(all_fold_probs, axis=0).squeeze()
final_preds = np.argmax(avg_probs, axis=1)
final_prob_class1 = avg_probs[:, 1]

results_df = test_df.copy()
results_df["predicted_label"] = final_preds
results_df["predicted_prob_class1"] = final_prob_class1
acc = accuracy_score(results_df["MGMT_value"], final_preds)
auc = roc_auc_score(results_df["MGMT_value"], final_prob_class1)

print(f"\n✅ Ensemble Accuracy: {acc:.4f}")
print(f"✅ Ensemble AUC: {auc:.4f}")
results_df.to_csv("ensemble_prediction_results.csv", index=False)
