import axios from 'axios';
import { injectRequestInterceptors, injectResponseInterceptors } from './interceptors';

const axiosInstance = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

injectRequestInterceptors(axiosInstance);
injectResponseInterceptors(axiosInstance);

export default axiosInstance;
