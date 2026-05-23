import { api } from './api';
import { Projeto, Fase } from '../types';

export interface ProjetoCreateParams {
  nome: string;
  tipo: string;
  stack_fe?: string;
  stack_be?: string;
  llm_base?: string;
  arquivos_criticos: string[];
  regras_especiais?: string;
  antigravity_path?: string;
}

export const projetosService = {
  listar: async (): Promise<Projeto[]> => {
    const res = await api.get('/api/projetos');
    return res.data;
  },
  criar: async (dados: ProjetoCreateParams): Promise<Projeto> => {
    const res = await api.post('/api/projetos', dados);
    return res.data;
  },
  obter: async (id: string): Promise<Projeto> => {
    const res = await api.get(`/api/projetos/${id}`);
    return res.data;
  },
  atualizar: async (id: string, dados: Partial<ProjetoCreateParams>): Promise<Projeto> => {
    const res = await api.put(`/api/projetos/${id}`, dados);
    return res.data;
  },
  listarFases: async (id: string): Promise<Fase[]> => {
    const res = await api.get(`/api/projetos/${id}/fases`);
    return res.data;
  },
  atualizarFases: async (id: string, fases: { id: string; percentual: number }[]): Promise<{ status: string; mensagem: string }> => {
    const res = await api.put(`/api/projetos/${id}/fases`, { fases });
    return res.data;
  },
  atualizarFaseUnica: async (id: string, faseId: string, percentual: number): Promise<{ status: string; mensagem: string }> => {
    const res = await api.put(`/api/projetos/${id}/fases/${faseId}`, { percentual });
    return res.data;
  },
  sincronizarAntigravity: async (id: string): Promise<any> => {
    const res = await api.get(`/api/sync/antigravity?projeto_id=${id}`);
    return res.data;
  },
  obterSaude: async (id: string): Promise<any> => {
    const res = await api.get(`/api/saude/projeto/${id}`);
    return res.data;
  },
  obterSaudeDashboard: async (): Promise<any> => {
    const res = await api.get('/api/saude/dashboard');
    return res.data;
  },
  validarEntrega: async (projetoId: string, pedido: string, entregue: string): Promise<any> => {
    const res = await api.post('/api/validador/comparar', { projeto_id: projetoId, pedido, entregue });
    return res.data;
  },
  gerarBriefing: async (projetoId: string): Promise<any> => {
    const res = await api.get(`/api/briefing/gerar?projeto_id=${projetoId}`);
    return res.data;
  },
  analisarErro: async (erroId: string): Promise<any> => {
    const res = await api.post('/api/erros-aprendidos/analisar', { erro_id: erroId });
    return res.data;
  },
  aplicarRegraErro: async (projetoId: string, regra: string): Promise<any> => {
    const res = await api.post('/api/erros-aprendidos/aplicar-regra', { projeto_id: projetoId, regra });
    return res.data;
  }
};
