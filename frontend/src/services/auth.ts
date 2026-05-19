import { api } from './api';
import { Usuario } from '../types';

interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export const authService = {
  login: async (email: string, senha: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', { email, senha });
    return response.data;
  },

  cadastro: async (nome: string, email: string, senha: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/cadastro', { nome, email, senha });
    return response.data;
  },

  logout: async (): Promise<{ status: string; mensagem: string }> => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  getMe: async (): Promise<Usuario> => {
    const response = await api.get<Usuario>('/api/auth/me');
    return response.data;
  },
};
