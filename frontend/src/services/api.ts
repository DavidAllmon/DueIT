import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:5009/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const login = (email: string, password: string) => api.post('/users/login', { email, password });
export const register = (email: string, password: string) => api.post('/users/register', { email, password });
export const getProfile = () => api.get('/users/profile');

export const getBills = () => api.get('/bills');
export const addBill = async (billData: any) => {
  try {
    const response = await api.post('/bills', billData);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to add bill');
  }
};

export const updateBill = (id: string, billData: any) => api.put(`/bills/${id}`, billData);
export const deleteBill = async (id: string) => {
  try {
    const response = await api.delete(`/bills/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to delete bill');
  }
};

function handleApiError(error: unknown, defaultMessage: string): never {
  console.error('API Error:', error);
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || defaultMessage);
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('Error message:', error.message);
      throw new Error('Error setting up the request');
    }
  }
  throw new Error(defaultMessage);
}

export default api;