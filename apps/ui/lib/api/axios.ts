import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  withCredentials: true, // JWT cookies
  timeout: 15000
});

// If using Authorization header instead of cookies:
api.interceptors.request.use((config) => {
  if(typeof window !== 'undefined'){
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
});