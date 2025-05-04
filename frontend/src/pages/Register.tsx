import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // First register the user
        await authApi.register(values.name, values.email, values.password, values.confirm_password);
        
        // Then login to get the token
        const loginResponse = await authApi.login(values.email, values.password);
        
        // Store the token and update auth state
        login(loginResponse.access_token);
        
        toast.success('Registration successful!');
        navigate('/dashboard');
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Registration failed');
      }
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 8,
      }}
    >
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1, maxWidth: 400, width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="new-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirm_password"
          label="Confirm Password"
          type="password"
          id="confirm_password"
          value={formik.values.confirm_password}
          onChange={formik.handleChange}
          error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
          helperText={formik.touched.confirm_password && formik.errors.confirm_password}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <MuiLink component={RouterLink} to="/login" variant="body2">
            Already have an account? Sign in
          </MuiLink>
        </Box>
      </Box>
    </Box>
  );
};

export default Register; 