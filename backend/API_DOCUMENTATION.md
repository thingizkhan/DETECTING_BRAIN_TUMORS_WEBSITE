# MRI Report Analysis API Documentation

## 📋 Overview

This document provides comprehensive documentation for the MRI Report Analysis API. The API is built with Flask and provides endpoints for user authentication, file uploads, and report management.

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is obtained from the login endpoint and should be stored securely (e.g., in localStorage) for subsequent requests.

## 📡 API Endpoints

### 1. Register User
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456",
    "confirm_password": "123456"
}
```

**Response (201 Created):**
```json
{
    "message": "User registered successfully"
}
```

**Error Responses:**
- 400: Missing required fields
- 400: Passwords do not match
- 400: Email already registered

### 2. Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "123456"
}
```

**Response (200 OK):**
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- 400: Missing email or password
- 401: Invalid email or password

### 3. Get User Profile
**Endpoint:** `GET /auth/profile`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
}
```

**Error Responses:**
- 401: Missing or invalid token
- 404: User not found

### 4. Change Password
**Endpoint:** `PUT /auth/password`

**Headers Required:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
    "old_password": "123456",
    "new_password": "654321",
    "confirm_password": "654321"
}
```

**Response (200 OK):**
```json
{
    "message": "Password updated successfully"
}
```

**Error Responses:**
- 400: Missing required fields
- 400: New passwords do not match
- 401: Invalid old password

### 5. Upload Report
**Endpoint:** `POST /upload`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Request Body:**
- Form Data with key `file`
- Allowed file types: PDF, CSV
- Maximum file size: 16MB

**Response (201 Created):**
```json
{
    "id": 1,
    "filename": "report.pdf",
    "result": "Pending",
    "timestamp": "2025-05-03T14:18:20.605305"
}
```

**Error Responses:**
- 400: No file part
- 400: No selected file
- 400: File type not allowed
- 413: File too large

### 6. Get Results
**Endpoint:** `GET /results`

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
    {
        "id": 1,
        "filename": "report.pdf",
        "result": "Pending",
        "timestamp": "2025-05-03T14:18:20.605305"
    }
]
```

## 🏗️ Backend Structure

### Technology Stack
- **Framework:** Flask 3.0.2
- **Database:** SQLite with SQLAlchemy ORM
- **Authentication:** Flask-JWT-Extended
- **File Handling:** Werkzeug
- **Password Hashing:** bcrypt
- **CORS:** Flask-CORS

### Project Structure
```
backend/
├── app.py              # Main application file
├── requirements.txt    # Dependencies
├── uploads/           # Directory for uploaded files
└── app.db            # SQLite database file
```

### Database Schema

#### User Table
```sql
CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);
```

#### Report Table
```sql
CREATE TABLE report (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    filename VARCHAR(255) NOT NULL,
    result VARCHAR(50) DEFAULT 'Pending',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user (id)
);
```

## 🔒 Security Considerations

1. **Password Security:**
   - Passwords are hashed using bcrypt
   - Minimum password requirements should be enforced on the frontend

2. **File Upload Security:**
   - Only PDF and CSV files are allowed
   - Maximum file size is 16MB
   - Files are stored with secure filenames

3. **Authentication:**
   - JWT tokens are used for authentication
   - Tokens should be stored securely on the frontend
   - Implement token refresh mechanism if needed

## 🚀 Frontend Implementation Tips

1. **Token Management:**
   ```javascript
   // Store token after login
   localStorage.setItem('token', response.data.access_token);

   // Use token in requests
   axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
   ```

2. **File Upload:**
   ```javascript
   const formData = new FormData();
   formData.append('file', selectedFile);

   axios.post('/upload', formData, {
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'multipart/form-data'
     }
   });
   ```

3. **Error Handling:**
   - Implement proper error handling for all API responses
   - Show user-friendly error messages
   - Handle token expiration and unauthorized access

## 📝 Notes for Frontend Team

1. **Environment Setup:**
   - API base URL: `http://localhost:4000`
   - All endpoints are prefixed with this base URL

2. **Testing:**
   - Use the provided Postman collection for testing
   - Test all error scenarios
   - Verify file upload functionality with different file types

3. **UI Considerations:**
   - Show loading states during API calls
   - Implement proper form validation
   - Provide feedback for successful operations
   - Handle file upload progress if needed

4. **Security Best Practices:**
   - Never store passwords in plain text
   - Implement proper token storage and refresh mechanism
   - Validate all user inputs
   - Sanitize file names before display 