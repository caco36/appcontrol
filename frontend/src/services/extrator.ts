import { api } from './api';

export interface ExtratorOutput {
  status: 'sucesso' | 'parcial' | 'falhou' | 'indefinido';
  resumo: string;
  arquivos_tocados: string[];
  arquivos_nao_tocados: string[];
  o_que_foi_feito: string[];
  o_que_nao_foi_feito: string[];
  erros_identificados: string[];
  riscos: string[];
  arquivos_criticos_mencionados: string[];
  limpeza_feita: string[];
  proximos_passos: string[];
  alertas: string[];
}

export interface AnalisarParams {
  resposta_ia: string;
  contexto?: string;
  projeto_id?: string;
}

export interface SalvarSessaoParams {
  projeto_id: string;
  analise: ExtratorOutput;
}

export interface RegistrarErrosParams {
  projeto_id: string;
  sessao_id?: string;
  erros: string[];
}

export const extratorService = {
  analisar: async (dados: AnalisarParams): Promise<ExtratorOutput> => {
    const res = await api.post('/api/extrator/analisar', dados);
    return res.data;
  },
  salvarSessao: async (dados: SalvarSessaoParams): Promise<any> => {
    const res = await api.post('/api/extrator/salvar-sessao', dados);
    return res.data;
  },
  registrarErros: async (dados: RegistrarErrosParams): Promise<{ status: string; mensagem: string }> => {
    const res = await api.post('/api/extrator/registrar-erros', dados);
    return res.data;
  }
};
