import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import bcrypt

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max file size
app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'csv', 'zip'}

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    reports = db.relationship('Report', backref='user', lazy=True)

class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    result = db.Column(db.String(50), default="Pending")
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Helper functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Routes
@app.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("Received registration data:", data)  # Debug log
        
        if not all(k in data for k in ('name', 'email', 'password', 'confirm_password')):
            print("Missing fields:", data)  # Debug log
            return jsonify({'error': 'Missing required fields'}), 400
        
        if data['password'] != data['confirm_password']:
            print("Passwords don't match")  # Debug log
            return jsonify({'error': 'Passwords do not match'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            print("Email already exists")  # Debug log
            return jsonify({'error': 'Email already registered'}), 400
        
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        user = User(
            name=data['name'],
            email=data['email'],
            password=hashed_password.decode('utf-8')
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        print("Registration error:", str(e))  # Debug log
        return jsonify({'error': str(e)}), 500

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not all(k in data for k in ('email', 'password')):
        return jsonify({'error': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not bcrypt.checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': access_token}), 200

@app.route('/auth/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email
    }), 200

@app.route('/auth/profile-update', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    # Update name if provided
    if 'name' in data:
        user.name = data['name']
    
    # Update email if provided and not already taken
    if 'email' in data:
        if data['email'] != user.email and User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already in use'}), 400
        user.email = data['email']
    
    try:
        db.session.commit()
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/auth/password', methods=['PUT'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not all(k in data for k in ('old_password', 'new_password', 'confirm_password')):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if data['new_password'] != data['confirm_password']:
        return jsonify({'error': 'New passwords do not match'}), 400
    
    user = User.query.get(user_id)
    
    if not bcrypt.checkpw(data['old_password'].encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({'error': 'Invalid old password'}), 401
    
    user.password = bcrypt.hashpw(data['new_password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    db.session.commit()
    
    return jsonify({'message': 'Password updated successfully'}), 200

@app.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)

    # Hasta klasörünü kaydedeceğimiz klasör
    patient_id = filename.split('.')[0]
    patient_folder = os.path.join(app.config['UPLOAD_FOLDER'], patient_id)
    os.makedirs(patient_folder, exist_ok=True)

    # Dosyayı .zip değilse klasör olarak açmamıza gerek yok (örneğin normal klasör gelirse direkt kullan)
    if filename.endswith('.zip'):
        import zipfile
        with zipfile.ZipFile(save_path, 'r') as zip_ref:
            zip_ref.extractall(patient_folder)
        os.remove(save_path)

    # Model tahmini al
    from model_utils import predict_patient_folder
    label, probability = predict_patient_folder(patient_folder)

    # Sonucu CSV'ye yaz
    import pandas as pd
    result_df = pd.DataFrame([{
        "filename": filename,
        "label": label,
        "probability": probability
    }])
    result_df.to_csv(os.path.join(patient_folder, "result.csv"), index=False)

    # Veritabanına yaz
    user_id = get_jwt_identity()
    result_str = f"Tespit Edilen: {'MGMT Mevcut' if label == 1 else 'MGMT Yok'} (Güven: {probability:.4f})"
    report = Report(user_id=user_id, filename=filename, result=result_str)
    db.session.add(report)
    db.session.commit()

    return jsonify({
        'id': report.id,
        'filename': filename,
        'result': report.result,
        'timestamp': report.timestamp.isoformat()
    }), 201

@app.route('/results', methods=['GET'])
@jwt_required()
def get_results():
    user_id = get_jwt_identity()
    reports = Report.query.filter_by(user_id=user_id).order_by(Report.timestamp.desc()).all()
    
    return jsonify([{
        'id': report.id,
        'filename': report.filename,
        'result': report.result,
        'timestamp': report.timestamp.isoformat()
    } for report in reports]), 200

@app.route('/results/<int:report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    user_id = get_jwt_identity()
    report = Report.query.filter_by(id=report_id, user_id=user_id).first()
    
    if not report:
        return jsonify({'error': 'Report not found or not authorized'}), 404
    
    # Delete associated file if it exists
    try:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], report.filename)
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Error deleting file: {str(e)}")
    
    # Delete the report
    db.session.delete(report)
    db.session.commit()
    
    return jsonify({'message': 'Report deleted successfully'}), 200

@app.route('/results/<int:report_id>/status', methods=['PUT'])
@jwt_required()
def update_report_status(report_id):
    user_id = get_jwt_identity()
    report = Report.query.filter_by(id=report_id, user_id=user_id).first()
    
    if not report:
        return jsonify({'error': 'Report not found or not authorized'}), 404
    
    data = request.get_json()
    if 'status' not in data:
        return jsonify({'error': 'Status is required'}), 400
    
    report.result = data['status']
    db.session.commit()
    
    return jsonify({
        'id': report.id,
        'filename': report.filename,
        'result': report.result,
        'timestamp': report.timestamp.isoformat()
    }), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=4000) 
