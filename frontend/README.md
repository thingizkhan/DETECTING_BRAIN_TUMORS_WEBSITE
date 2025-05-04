# MRI Report Analysis Frontend

This is the frontend application for the MRI Report Analysis system. It provides a user interface for uploading and analyzing MRI reports, with features for user authentication and result management.

## Features

- User authentication (login/register)
- Secure file upload for MRI reports
- Real-time result tracking
- User profile management
- Responsive design
- Modern UI with Material-UI components

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend API running on `http://localhost:4000`

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── api/            # API service functions
│   ├── components/     # Reusable components
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── index.tsx       # Entry point
```

## Technologies Used

- React
- TypeScript
- Material-UI
- React Router
- Formik
- Yup
- Axios
- React Toastify

## API Integration

The frontend communicates with the backend API using the following endpoints:

- Authentication:
  - POST `/auth/register` - User registration
  - POST `/auth/login` - User login
  - GET `/auth/profile` - Get user profile
  - PUT `/auth/password` - Change password

- Reports:
  - POST `/upload` - Upload MRI report
  - GET `/results` - Get analysis results

## Security

- JWT-based authentication
- Secure password handling
- Protected routes
- Input validation
- File type restrictions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
