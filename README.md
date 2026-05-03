# 🧠 Brain Tumor & MGMT Methylation Classification Web App

Full-stack medical AI web application for MRI-based MGMT methylation prediction using multimodal brain MRI scans, a MONAI/PyTorch 3D DenseNet model, Flask backend API, and React TypeScript frontend.

---

## 📌 Overview

This project combines a deep learning MRI classification pipeline with a web-based interface. Users can register, log in, upload patient MRI data, and receive MGMT methylation prediction results.

The backend handles preprocessing and model inference, while the frontend provides a user-friendly interface for interaction.

---

## 🧠 AI Pipeline

```text
Patient MRI Folder
        ↓
FLAIR / T1w / T1wCE / T2w DICOM Series
        ↓
Slice Selection + Preprocessing
        ↓
Tensor: (1, 4, 64, 256, 256)
        ↓
3D DenseNet121 (MONAI / PyTorch)
        ↓
5-Fold Ensemble + TTA
        ↓
MGMT Prediction
        ↓
API Response
```

---

## ⚙️ Features

- User authentication
- JWT-based authorization
- MRI upload system
- Multimodal MRI processing
- MONAI / PyTorch inference
- 5-fold ensemble prediction
- Result storage and retrieval
- React TypeScript frontend
- Flask REST API backend

---

## 🧬 MRI Modalities

The system expects four modality folders:

```text
FLAIR/
T1w/
T1wCE/
T2w/
```

Each folder should contain DICOM slices.

---

## 🛠️ Tech Stack

### Backend

- Python
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-CORS
- PyTorch
- MONAI
- pydicom
- OpenCV
- NumPy
- SQLite

### Frontend

- React
- TypeScript
- Material UI
- Axios
- React Router
- Formik
- Yup
- React Toastify

---

## 📂 Project Structure

```text
.
├── backend/
│   ├── app.py
│   ├── model_utils.py
│   ├── train.py
│   ├── requirements.txt
│   ├── API_DOCUMENTATION.md
│   ├── postman_collection.json
│   └── Capstone_Project_Presentation.pdf
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation & Usage

### Backend Setup

```bash
cd backend
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

macOS / Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run backend:

```bash
python app.py
```

Backend URL:

```text
http://localhost:4000
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend URL:

```text
http://localhost:3000
```

---

## 🔌 API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/profile
PUT  /auth/profile-update
PUT  /auth/password
```

### Prediction / Results

```text
POST /upload
GET  /results
```

Detailed API documentation:

```text
backend/API_DOCUMENTATION.md
```

Postman collection:

```text
backend/postman_collection.json
```

---

## 📦 Model Files

Trained model weights are not included in this repository because of file size limitations.

Expected model files:

```text
backend/best_model_fold1.pth
backend/best_model_fold2.pth
backend/best_model_fold3.pth
backend/best_model_fold4.pth
backend/best_model_fold5.pth
```

Model paths can be changed in:

```text
backend/model_utils.py
```

---

## 📊 Dataset

This project was developed using the RSNA-MICCAI Brain Tumor Radiogenomic Classification dataset.

The system predicts MGMT promoter methylation status:

```text
0 = Unmethylated
1 = Methylated
```

Dataset files are not included because of size and medical data constraints.

---

## 🧪 Model Details

The inference pipeline uses:

- MONAI DenseNet121
- 3D convolutional processing
- 4 MRI input channels
- 64 slices per modality
- Input tensor shape: `(1, 4, 64, 256, 256)`
- Softmax output for binary classification
- 5-fold model ensemble
- Test-time augmentation

---

## 🔐 Security Notes

- Passwords are hashed
- JWT tokens are used for protected routes
- Uploaded files are stored locally
- SQLite is used for local development
- This project is intended for educational and research purposes only

---

## ⚠️ Limitations

- Model weights are not included
- Dataset is not included
- The application is not medically validated
- Current implementation is for demonstration and research purposes only

---

## 📈 Future Improvements

- Clean backend folder structure
- Move model files to external storage
- Add Docker support
- Add deployment configuration
- Improve frontend upload flow
- Add Grad-CAM or visual explainability
- Add model performance dashboard
- Support cloud storage for MRI uploads

---

## 👨‍💻 Authors

Deniz Arda Yildiz  
Mehmet Cengizhan KINAY

---

## ⭐ Notes

This project demonstrates an end-to-end medical AI system combining MRI preprocessing, deep learning inference, backend API development, and frontend integration.
