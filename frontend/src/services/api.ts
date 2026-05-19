import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação persistido
api.interceptors.request.use((config) => {
  const storageStr = localStorage.getItem('appcontrol-auth-storage');
  if (storageStr) {
    try {
      const { state } = JSON.parse(storageStr);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (e) {
      console.error('Erro ao ler token do localStorage no interceptor', e);
    }
  }
  return config;
});
