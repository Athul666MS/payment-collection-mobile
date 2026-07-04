import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../constants/config';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. Please check your connection and try again.'));
    }
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your internet connection.'));
    }
    const message = error.response?.data?.message || 'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  },
);

export default axiosClient;
