import axios from 'axios';
import { useAuthStore } from '../store/auth';

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

let isNavigatingToLogin = false;

// Interceptor de Resposta (A Barreira 1 - O Escudo)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    // Risco 1 evitado: A trava anti-loop. Ignora endpoints de login/cadastro.
    const isAuthRoute = url.includes('/login') || url.includes('/cadastro') || url.includes('supabase');

    if ((status === 401 || status === 403) && !isAuthRoute) {
      console.warn('Escudo Ativado: Acesso Negado (401/403). Ejetando usuário via React Router...');
      
      // Limpa a memória do cache
      localStorage.removeItem('appcontrol-auth-storage');
      
      // Risco de Múltiplos Requests evitado
      if (!isNavigatingToLogin && window.location.pathname !== '/login') {
        isNavigatingToLogin = true;
        
        // Força a remoção do token DIRETAMENTE na memória do React.
        // Isso faz o componente <ProtectedRoute> re-renderizar e disparar o <Navigate to="/login" replace />
        // É impossível o navegador bloquear isso, pois é navegação interna do React Router!
        useAuthStore.setState({ token: null, usuario: null, erro: 'Sua sessão expirou. Faça login novamente.' });
      }
    }

    return Promise.reject(error);
  }
);
