import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Projeto } from '../types';
import { projetosService, ProjetoCreateParams } from '../services/projetos';

interface ProjetosState {
  projetos: Projeto[];
  projetoAtivo: Projeto | null;
  loading: boolean;
  erro: string | null;

  listar: () => Promise<void>;
  criar: (dados: ProjetoCreateParams) => Promise<Projeto>;
  selecionarProjeto: (id: string) => Promise<void>;
  atualizarProjeto: (id: string, dados: Partial<ProjetoCreateParams>) => Promise<Projeto>;
  atualizarFases: (fases: { id: string; percentual: number }[]) => Promise<void>;
  atualizarFaseUnica: (faseId: string, percentual: number) => Promise<void>;
  limparErro: () => void;
}

export const useProjetosStore = create<ProjetosState>()(
  persist(
    (set, get) => ({
      projetos: [],
      projetoAtivo: null,
      loading: false,
      erro: null,

      listar: async () => {
        set({ loading: true, erro: null });
        try {
          const projetos = await projetosService.listar();
          set({ projetos, loading: false });
        } catch (error: any) {
          const mensagem = error.response?.data?.detail || 'Erro ao carregar lista de projetos.';
          set({ erro: mensagem, loading: false });
        }
      },

      criar: async (dados) => {
        set({ loading: true, erro: null });
        try {
          const novoProjeto = await projetosService.criar(dados);
          set((state) => ({
            projetos: [novoProjeto, ...state.projetos],
            projetoAtivo: novoProjeto,
            loading: false
          }));
          return novoProjeto;
        } catch (error: any) {
          const mensagem = error.response?.data?.detail || 'Erro ao criar projeto.';
          set({ erro: mensagem, loading: false });
          throw error;
        }
      },

      selecionarProjeto: async (id) => {
        set({ loading: true, erro: null });
        try {
          const projeto = await projetosService.obter(id);
          set({ projetoAtivo: projeto, loading: false });
        } catch (error: any) {
          const mensagem = error.response?.data?.detail || 'Erro ao carregar detalhes do projeto.';
          set({ erro: mensagem, loading: false });
          throw error;
        }
      },

      atualizarProjeto: async (id, dados) => {
        set({ loading: true, erro: null });
        try {
          const projetoAtualizado = await projetosService.atualizar(id, dados);
          set((state) => ({
            projetos: state.projetos.map(p => p.id === id ? { ...p, ...projetoAtualizado } : p),
            projetoAtivo: state.projetoAtivo?.id === id ? projetoAtualizado : state.projetoAtivo,
            loading: false
          }));
          return projetoAtualizado;
        } catch (error: any) {
          const mensagem = error.response?.data?.detail || 'Erro ao atualizar configurações do projeto.';
          set({ erro: mensagem, loading: false });
          throw error;
        }
      },

      atualizarFases: async (fases) => {
        const { projetoAtivo } = get();
        if (!projetoAtivo) return;

        set({ loading: true, erro: null });
        try {
          await projetosService.atualizarFases(projetoAtivo.id, fases);
          // Recarrega o projeto ativo para atualizar as fases e o progresso
          const projetoAtualizado = await projetosService.obter(projetoAtivo.id);
          set({ projetoAtivo: projetoAtualizado, loading: false });
        } catch (error: any) {
          const mensagem = error.response?.data?.detail || 'Erro ao atualizar fases.';
          set({ erro: mensagem, loading: false });
          throw error;
        }
      },

      atualizarFaseUnica: async (faseId, percentual) => {
        const { projetoAtivo } = get();
        if (!projetoAtivo) return;

        set({ loading: true, erro: null });
        try {
          await projetosService.atualizarFaseUnica(projetoAtivo.id, faseId, percentual);
          const projetoAtualizado = await projetosService.obter(projetoAtivo.id);
          set({ projetoAtivo: projetoAtualizado, loading: false });
        } catch (error: any) {
          const mensagem = error.response?.data?.detail || 'Erro ao atualizar fase.';
          set({ erro: mensagem, loading: false });
          throw error;
        }
      },

      limparErro: () => set({ erro: null }),
    }),
    {
      name: 'appcontrol-projetos-storage',
      partialize: (state) => ({ projetoAtivo: state.projetoAtivo }),
    }
  )
);
