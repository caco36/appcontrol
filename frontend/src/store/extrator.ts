import { create } from 'zustand';
import { extratorService, ExtratorOutput } from '../services/extrator';

interface ExtratorState {
  respostaIa: string;
  contexto: string;
  resultado: ExtratorOutput | null;
  loading: boolean;
  erro: string | null;
  salvandoSessao: boolean;
  salvandoErros: boolean;
  sessaoSalvaId: string | null;
  errosSalvosStatus: string | null;

  setRespostaIa: (texto: string) => void;
  setContexto: (texto: string) => void;
  analisar: (projetoId?: string) => Promise<void>;
  salvarSessao: (projetoId: string) => Promise<any>;
  registrarErros: (projetoId: string) => Promise<void>;
  limpar: () => void;
  limparErro: () => void;
}

export const useExtratorStore = create<ExtratorState>((set, get) => ({
  respostaIa: '',
  contexto: '',
  resultado: null,
  loading: false,
  erro: null,
  salvandoSessao: false,
  salvandoErros: false,
  sessaoSalvaId: null,
  errosSalvosStatus: null,

  setRespostaIa: (texto) => set({ respostaIa: texto }),
  setContexto: (texto) => set({ contexto: texto }),

  analisar: async (projetoId) => {
    const { respostaIa, contexto } = get();
    if (!respostaIa.trim()) {
      set({ erro: 'A resposta da IA não pode estar vazia.' });
      return;
    }

    set({ loading: true, erro: null, resultado: null, sessaoSalvaId: null, errosSalvosStatus: null });
    try {
      const resultado = await extratorService.analisar({
        resposta_ia: respostaIa,
        contexto: contexto.trim() || undefined,
        projeto_id: projetoId
      });
      set({ resultado, loading: false });
    } catch (error: any) {
      const mensagem = error.response?.data?.detail || 'Erro ao analisar resposta da IA.';
      set({ erro: mensagem, loading: false });
    }
  },

  salvarSessao: async (projetoId) => {
    const { resultado } = get();
    if (!resultado) return;

    set({ salvandoSessao: true, erro: null });
    try {
      const sessao = await extratorService.salvarSessao({
        projeto_id: projetoId,
        analise: resultado
      });
      set({ sessaoSalvaId: sessao.id, salvandoSessao: false });
      return sessao;
    } catch (error: any) {
      const mensagem = error.response?.data?.detail || 'Erro ao salvar sessão no histórico.';
      set({ erro: mensagem, salvandoSessao: false });
      throw error;
    }
  },

  registrarErros: async (projetoId) => {
    const { resultado, sessaoSalvaId } = get();
    if (!resultado || !resultado.erros_identificados || resultado.erros_identificados.length === 0) return;

    set({ salvandoErros: true, erro: null });
    try {
      const res = await extratorService.registrarErros({
        projeto_id: projetoId,
        sessao_id: sessaoSalvaId || undefined,
        erros: resultado.erros_identificados
      });
      set({ errosSalvosStatus: res.mensagem, salvandoErros: false });
    } catch (error: any) {
      const mensagem = error.response?.data?.detail || 'Erro ao registrar erros no banco.';
      set({ erro: mensagem, salvandoErros: false });
      throw error;
    }
  },

  limpar: () => set({ 
    respostaIa: '', 
    contexto: '', 
    resultado: null, 
    erro: null, 
    sessaoSalvaId: null, 
    errosSalvosStatus: null 
  }),

  limparErro: () => set({ erro: null })
}));
