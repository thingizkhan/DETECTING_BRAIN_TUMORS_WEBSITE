# MRI Report Analysis Backend

A Flask backend for managing user accounts, file uploads, and report results for an MRI analysis application.

## Features

- User registration and authentication
- JWT-based secure authentication
- File upload handling (PDF and CSV)
- Report management
- Password change functionality

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory with:
```
JWT_SECRET_KEY=your-secret-key-here
```

4. Run the application:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/profile` - Get user profile
- `PUT /auth/password` - Change password

### Reports
- `POST /upload` - Upload a new report
- `GET /results` - Get all reports for the current user

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens are required for protected routes
- File uploads are limited to 16MB
- Only PDF and CSV files are allowed
- Files are stored in the `uploads` directory

## Development

The application uses:
- Flask for the web framework
- SQLAlchemy for database operations
- Flask-JWT-Extended for authentication
- Flask-CORS for cross-origin requests
- bcrypt for password hashing 