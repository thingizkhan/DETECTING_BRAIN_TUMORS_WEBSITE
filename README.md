# 🧠 Brain Tumor & MGMT Methylation Detection Using 3D CNN

This project focuses on the classification of brain tumors and prediction of MGMT promoter methylation status using 3D Convolutional Neural Networks (3D CNNs) on MRI data. The goal is to support non-invasive radiogenomic diagnosis in clinical settings.

---

## 📁 Dataset

The dataset used is the **RSNA-MICCAI Brain Tumor Radiogenomic Classification** dataset, which contains multimodal MRI scans labeled with MGMT promoter methylation status.

### Modalities:
- T1-weighted (T1w)
- Contrast-enhanced T1 (T1wCE)
- T2-weighted (T2w)
- Fluid-attenuated inversion recovery (FLAIR)

### Labels:
- `MGMT_promoter_status`: 
  - 0 = Unmethylated  
  - 1 = Methylated

---

## 🧪 Preprocessing

- Skull stripping and NIfTI volume conversion
- Normalization of image intensities
- Resizing to consistent shape (e.g., 64×256×256)
- Stacking all four modalities per subject
- Data augmentation with flipping and noise

---

## 🧠 Model

Built a custom 3D CNN architecture using MONAI & PyTorch to process multi-channel 3D MRI volumes.

- Input shape: `(4, 64, 256, 256)` → 4 modalities, 64 slices
- Used BatchNorm3D, ReLU, Dropout, and MaxPooling layers
- Output: binary softmax classification for MGMT status

---

## ⚙️ Training Setup

- 5-fold cross-validation
- Batch size: 1 (due to 3D volume size)
- Optimizer: Adam
- Loss: CrossEntropyLoss
- Hardware: Trained on Google Cloud with NVIDIA L4 GPU

---

## 📊 Evaluation Metrics

- **Validation Accuracy**: ~85–90% per fold
- **Confusion Matrix**, **Precision**, **Recall**, **F1-score**
- Majority voting and test-time augmentation for final prediction

---

## ▶️ Usage

```bash
# Clone the repo and install dependencies
pip install monai nibabel torch torchvision

# Run preprocessing and training
python train.py
```

---

## 📂 Folder Structure

```
brain_tumor_mgmt/
├── data/
│   └── subject folders with NIfTI files
├── models/
│   └── best_model_fold*.pt
├── src/
│   ├── train.py
│   └── dataset.py
├── utils/
├── outputs/
├── README.md
```

---

## 📌 Key Contributions

- Demonstrated application of 3D CNNs to real-world neuroimaging classification.
- Proposed a radiogenomic-based solution for MGMT methylation detection.
- Achieved competitive validation accuracy with explainable modeling.

---

## 👨‍💻 Author

Deniz Arda YILDIZ  


---

## 📝 License

This project is open-source and available under the MIT License.
