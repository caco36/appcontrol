export interface Usuario {
  id: string;
  email: string;
  nome?: string;
  criado_em?: string;
}

export interface Projeto {
  id: string;
  usuario_id: string;
  nome: string;
  tipo: string;
  stack_fe?: string;
  stack_be?: string;
  llm_base?: string;
  arquivos_criticos: string[];
  regras_especiais?: string;
  criado_em?: string;
  atualizado_em?: string;
  progresso?: number;
  sessoes_count?: number;
  fases?: Fase[];
  sessoes?: Sessao[];
  erros?: Erro[];
}

export interface Fase {
  id: string;
  projeto_id: string;
  nome: string;
  ordem: number;
  percentual: number;
}

export type SessaoStatus = 'sucesso' | 'parcial' | 'falhou';
export type SessaoFonte = 'manual' | 'extrator';

export interface Sessao {
  id: string;
  projeto_id: string;
  data?: string;
  status: SessaoStatus;
  resumo?: string;
  arquivos_tocados: string[];
  arquivos_nao_tocados: string[];
  o_que_foi_feito: string[];
  o_que_nao_foi_feito: string[];
  alertas: string[];
  riscos: string[];
  proximos_passos: string[];
  fonte: SessaoFonte;
}

export interface Erro {
  id: string;
  projeto_id: string;
  sessao_id?: string;
  tipo: string;
  arquivo?: string;
  descricao: string;
  solucao?: string;
  data?: string;
}
