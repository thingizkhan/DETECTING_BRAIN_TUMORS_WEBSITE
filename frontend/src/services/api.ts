import axios from 'axios';

const API_URL = 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (name: string, email: string, password: string, confirm_password: string) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      confirm_password
    });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.put('/auth/password', {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: newPassword
    });
    return response.data;
  }
};

export const reportApi = {
  uploadReport: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getResults: async () => {
    const response = await api.get('/results');
    return response.data;
  },
  getReport: async (id: string) => {
    const response = await api.get(`/results/${id}`);
    return response.data;
  },
};

export default api; 