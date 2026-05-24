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

// Interceptor de Resposta (A Barreira 1 - O Escudo)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Risco 1 evitado: A trava anti-loop. Ignora endpoints de login/cadastro.
    const isAuthRoute = url.includes('/login') || url.includes('/cadastro') || url.includes('supabase');

    if ((status === 401 || status === 403) && !isAuthRoute) {
      console.warn('Escudo Ativado: Acesso Negado (401/403). Ejetando usuário...');
      
      // Limpa a memória física do Zustand no cache do navegador
      localStorage.removeItem('appcontrol-auth-storage');
      
      // Redireciona o usuário (O reload limpa toda a RAM instantaneamente)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
