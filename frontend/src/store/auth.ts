import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Usuario } from '../types';
import { supabase } from '../services/supabase';

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
    (set) => ({
      usuario: null,
      token: null,
      loading: false,
      erro: null,

      login: async (email, senha) => {
        set({ loading: true, erro: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
          if (error) throw error;
          const user = data.user;
          const session = data.session;
          const nome = user?.user_metadata?.nome || user?.email?.split('@')[0] || '';
          set({
            usuario: { id: user!.id, email: user!.email!, nome },
            token: session!.access_token,
            loading: false,
          });
        } catch (error: any) {
          const mensagem = error.message?.includes('Invalid login credentials')
            ? 'Email ou senha incorretos.'
            : error.message || 'Erro ao realizar login.';
          set({ erro: mensagem, loading: false });
          throw error;
        }
      },

      cadastro: async (nome, email, senha) => {
        set({ loading: true, erro: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password: senha,
            options: { data: { nome } },
          });
          if (error) throw error;
          const user = data.user;
          const session = data.session;
          set({
            usuario: { id: user!.id, email: user!.email!, nome },
            token: session?.access_token || null,
            loading: false,
          });
        } catch (error: any) {
          const mensagem = error.message || 'Erro ao realizar cadastro.';
          set({ erro: mensagem, loading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.error('Erro no logout', e);
        } finally {
          set({ usuario: null, token: null, loading: false, erro: null });
        }
      },

      carregarSessao: async () => {
        set({ loading: true, erro: null });
        try {
          const { data } = await supabase.auth.getSession();
          const session = data.session;
          if (session) {
            const user = session.user;
            const nome = user?.user_metadata?.nome || user?.email?.split('@')[0] || '';
            set({
              usuario: { id: user.id, email: user.email!, nome },
              token: session.access_token,
              loading: false,
            });
          } else {
            set({ usuario: null, token: null, loading: false });
          }
        } catch (error) {
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
