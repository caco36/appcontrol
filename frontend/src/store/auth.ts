import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario } from '../types';
import { authService } from '../services/auth';

interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  loading: boolean;
  erro: string | null;
  login: (email: string, senha: string) => Promise<void>;
  cadastro: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  carregarSessao: () => Promise<void>;
  limparErro: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,
      token: null,
      loading: false,
      erro: null,

      login: async (email, senha) => {
        set({ loading: true, erro: null });
        try {
          const data = await authService.login(email, senha);
          set({ usuario: data.usuario, token: data.token, loading: false });
        } catch (error: any) {
          const mensagem = error.response?.data?.detail || 'Erro ao realizar login. Verifique suas credenciais.';
          set({ erro: mensagem, loading: false });
          throw error;
        }
      },

      cadastro: async (nome, email, senha) => {
        set({ loading: true, erro: null });
        try {
          const data = await authService.cadastro(nome, email, senha);
          set({ usuario: data.usuario, token: data.token, loading: false });
        } catch (error: any) {
          const mensagem = error.response?.data?.detail || 'Erro ao realizar cadastro.';
          set({ erro: mensagem, loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await authService.logout();
        } catch (e) {
          console.error('Erro no logout da API', e);
        } finally {
          set({ usuario: null, token: null, loading: false, erro: null });
        }
      },

      carregarSessao: async () => {
        const { token } = get();
        if (!token) return;

        set({ loading: true, erro: null });
        try {
          const usuario = await authService.getMe();
          set({ usuario, loading: false });
        } catch (error) {
          console.error('Sessão expirada ou inválida', error);
          set({ usuario: null, token: null, loading: false });
        }
      },

      limparErro: () => set({ erro: null }),
    }),
    {
      name: 'appcontrol-auth-storage',
      partialize: (state) => ({ token: state.token, usuario: state.usuario }),
    }
  )
);
