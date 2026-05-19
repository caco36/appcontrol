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
  }
};
