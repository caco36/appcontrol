import React, { useState, useMemo } from 'react';
import { useProjetosStore } from '../store/projetos';
import { 
  History, Sparkles, Copy, CheckCircle2, AlertCircle, 
  Search, Filter, ChevronDown, ChevronUp, Terminal, FileCode, CheckSquare, XSquare, AlertTriangle, ShieldAlert, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Historico: React.FC = () => {
  const { projetoAtivo } = useProjetosStore();

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});

  const [promptMemoria, setPromptMemoria] = useState<string>('');
  const [copiado, setCopiado] = useState(false);

  const toggleExpandir = (id: string) => {
    setExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sessoesFiltradas = useMemo(() => {
    if (!projetoAtivo?.sessoes) return [];

    return projetoAtivo.sessoes.filter(sessao => {
      const matchStatus = filtroStatus === 'todos' || sessao.status === filtroStatus;
      const matchBusca = busca === '' || (
        (sessao.resumo?.toLowerCase().includes(busca.toLowerCase())) ||
        (sessao.arquivos_tocados?.some(a => a.toLowerCase().includes(busca.toLowerCase())))
      );
      return matchStatus && matchBusca;
    });
  }, [projetoAtivo?.sessoes, filtroStatus, busca]);

  const handleGerarPromptMemoria = () => {
    if (!projetoAtivo?.sessoes) return;

    // Pega as últimas 5 sessões para não estourar o limite de tokens da IA
    const ultimasSessoes = [...projetoAtivo.sessoes].slice(0, 5);

    const sessoesFormatadas = ultimasSessoes.map((s, idx) => {
      return `[Sessão #${ultimasSessoes.length - idx} — Data: ${s.data ? new Date(s.data).toLocaleDateString() : 'N/A'} — Status: ${s.status.toUpperCase()}]
RESUMO: ${s.resumo || 'Sem resumo'}
ARQUIVOS MODIFICADOS: ${s.arquivos_tocados?.join(', ') || 'Nenhum'}

O QUE FOI FEITO:
${s.o_que_foi_feito?.map(item => `- ${item}`).join('\n') || '- N/A'}

PRÓXIMOS PASSOS IDENTIFICADOS:
${s.proximos_passos?.map(item => `- ${item}`).join('\n') || '- N/A'}
--------------------------------------------------------------------------------`;
    }).join('\n\n');

    const prompt = `[AppControl v1.0 — Memória Externa / Histórico de Decisões]
PROJETO ATIVO: ${projetoAtivo.nome}
TIPO: ${projetoAtivo.tipo}

================================================================================
OBJETIVO DESTE PROMPT DE MEMÓRIA
================================================================================
Este documento consolida o histórico recente de sessões e decisões arquiteturais tomadas no projeto. A IA deve analisar este histórico antes de propor novas soluções para garantir continuidade, evitar retrabalho e não reintroduzir bugs previamente corrigidos.

================================================================================
HISTÓRICO RECENTE DE SESSÕES (ORDEM CRONOLÓGICA REVERSA)
================================================================================
${sessoesFormatadas}

================================================================================
DIRETRIZES DE RETOMADA PARA A IA
================================================================================
1. Alinhe suas próximas sugestões com os 'PRÓXIMOS PASSOS IDENTIFICADOS' na última sessão válida.
2. Respeite as decisões arquiteturais e os arquivos modificados anteriormente.
3. Caso identifique inconsistências entre o histórico e o pedido atual do usuário, solicite esclarecimentos antes de codificar.`;

    setPromptMemoria(prompt);
  };

  const handleCopiar = () => {
    if (!promptMemoria) return;
    navigator.clipboard.writeText(promptMemoria);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  if (!projetoAtivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 animate-fade-in font-sans">
        <AlertCircle className="w-12 h-12 text-yellow-500" />
        <h3 className="text-xl font-bold text-white">Nenhum Projeto Ativo Selecionado</h3>
        <p className="text-sm text-gray-400 font-mono max-w-md">
          Para visualizar e filtrar o Histórico de Sessões, selecione ou crie um projeto no Dashboard ou na Sidebar.
        </p>
        <Link to="/" className="px-6 py-3 bg-[#e8ff5a] text-[#0d0d0d] font-bold rounded-xl hover:bg-[#d4eb45] transition-all text-xs uppercase tracking-wider shadow-lg shadow-[#e8ff5a]/10">
          Ir para o Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">
      {/* Cabeçalho */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <History className="w-48 h-48 text-[#e8ff5a]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-[#2a2a2a]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 text-[#e8ff5a] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Memória Cumulativa
              </span>
              <span className="text-xs text-gray-500 font-mono">Projeto: {projetoAtivo.nome}</span>
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Módulo Histórico de Sessões
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Consulte registros passados da IA, filtre por status/arquivos e gere o prompt de memória externa.
            </p>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-4">
            <History className="w-8 h-8 text-[#e8ff5a]" />
            <div>
              <div className="text-xs text-gray-400 font-mono">Total de Sessões</div>
              <div className="text-sm font-bold text-[#e8ff5a] font-mono">{projetoAtivo.sessoes?.length || 0} Registradas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal: Listagem de Sessões e Exibição do Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Painel Esquerdo: Listagem e Filtros */}
        <div className="lg:col-span-7 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a2a2a] pb-6">
            {/* Barra de Busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por resumo ou arquivo modificado..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#e8ff5a]/50 transition-colors font-sans"
              />
            </div>

            {/* Filtro de Status */}
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="bg-[#0d0d0d] border border-[#2a2a2a] text-white text-xs font-mono rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#e8ff5a]/50 transition-colors cursor-pointer"
              >
                <option value="todos">Todos os Status</option>
                <option value="sucesso">Sucesso</option>
                <option value="parcial">Parcial</option>
                <option value="falhou">Falhou</option>
              </select>
            </div>
          </div>

          {/* Lista de Sessões Acordeão */}
          <div className="space-y-4">
            {sessoesFiltradas.length > 0 ? (
              sessoesFiltradas.map((sessao) => {
                const isExpanded = !!expandidos[sessao.id];
                return (
                  <div key={sessao.id} className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl overflow-hidden transition-all group hover:border-[#3a3a3a]">
                    {/* Cabeçalho do Card (Clicável) */}
                    <div 
                      onClick={() => toggleExpandir(sessao.id)}
                      className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none bg-[#121212]/50 hover:bg-[#151515] transition-colors"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                            sessao.status === 'sucesso' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            sessao.status === 'parcial' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {sessao.status}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            {sessao.data ? new Date(sessao.data).toLocaleString() : 'Data não informada'}
                          </span>
                          <span className="px-2 py-0.5 bg-[#2a2a2a]/60 text-gray-400 border border-[#2a2a2a] rounded text-[10px] font-mono uppercase">
                            {sessao.fonte}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-200 truncate font-sans">
                          {sessao.resumo || 'Sessão sem resumo especificado.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-gray-500 group-hover:text-white transition-colors shrink-0">
                        <span className="text-xs font-mono hidden sm:inline">
                          {isExpanded ? 'Recolher' : 'Expandir'}
                        </span>
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Corpo Expandido */}
                    {isExpanded && (
                      <div className="p-6 border-t border-[#2a2a2a] space-y-6 bg-[#0d0d0d] animate-fade-in">
                        {/* Resumo Completo */}
                        <div className="space-y-2">
                          <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Resumo Detalhado</h5>
                          <p className="text-xs text-gray-300 font-sans leading-relaxed bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a]">
                            {sessao.resumo || 'Nenhum resumo detalhado disponível.'}
                          </p>
                        </div>

                        {/* Arquivos Tocados e Não Tocados */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <FileCode className="w-3.5 h-3.5" /> Arquivos Modificados
                            </h5>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {sessao.arquivos_tocados?.length > 0 ? (
                                sessao.arquivos_tocados.map((arq, i) => (
                                  <span key={i} className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-lg font-mono text-xs">
                                    {arq}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-500 font-mono text-xs">Nenhum arquivo modificado.</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <FileCode className="w-3.5 h-3.5" /> Arquivos Intactos
                            </h5>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {sessao.arquivos_nao_tocados?.length > 0 ? (
                                sessao.arquivos_nao_tocados.map((arq, i) => (
                                  <span key={i} className="px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 rounded-lg font-mono text-xs">
                                    {arq}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-500 font-mono text-xs">Nenhum arquivo listado.</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* O que foi feito e O que não foi feito */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div className="space-y-2">
                            <h5 className="text-xs font-bold text-green-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <CheckSquare className="w-3.5 h-3.5" /> O Que Foi Feito
                            </h5>
                            <ul className="space-y-1.5 bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a]">
                              {sessao.o_que_foi_feito?.length > 0 ? (
                                sessao.o_que_foi_feito.map((item, i) => (
                                  <li key={i} className="text-xs text-gray-300 font-sans flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500 font-mono text-xs">Nenhum registro.</li>
                              )}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-xs font-bold text-yellow-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <XSquare className="w-3.5 h-3.5" /> O Que Não Foi Feito
                            </h5>
                            <ul className="space-y-1.5 bg-[#1a1a1a] p-4 rounded-xl border border-[#2a2a2a]">
                              {sessao.o_que_nao_foi_feito?.length > 0 ? (
                                sessao.o_que_nao_foi_feito.map((item, i) => (
                                  <li key={i} className="text-xs text-gray-300 font-sans flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5 shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-500 font-mono text-xs">Nenhum registro.</li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Alertas, Riscos e Próximos Passos */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                          <div className="space-y-2">
                            <h5 className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" /> Alertas
                            </h5>
                            <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl space-y-1">
                              {sessao.alertas?.length > 0 ? (
                                sessao.alertas.map((alerta, i) => (
                                  <div key={i} className="text-xs text-orange-300 font-sans">• {alerta}</div>
                                ))
                              ) : (
                                <div className="text-gray-500 font-mono text-xs">Sem alertas.</div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <ShieldAlert className="w-3.5 h-3.5" /> Riscos
                            </h5>
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
                              {sessao.riscos?.length > 0 ? (
                                sessao.riscos.map((risco, i) => (
                                  <div key={i} className="text-xs text-red-300 font-sans">• {risco}</div>
                                ))
                              ) : (
                                <div className="text-gray-500 font-mono text-xs">Sem riscos.</div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h5 className="text-xs font-bold text-[#e8ff5a] uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <ArrowRight className="w-3.5 h-3.5" /> Próximos Passos
                            </h5>
                            <div className="p-3 bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 rounded-xl space-y-1">
                              {sessao.proximos_passos?.length > 0 ? (
                                sessao.proximos_passos.map((passo, i) => (
                                  <div key={i} className="text-xs text-[#e8ff5a] font-sans">• {passo}</div>
                                ))
                              ) : (
                                <div className="text-gray-500 font-mono text-xs">Sem próximos passos.</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center p-8 text-gray-500 font-mono text-xs border border-[#2a2a2a] rounded-xl bg-[#0d0d0d]">
                Nenhuma sessão encontrada com os filtros atuais.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#2a2a2a]">
            <button
              type="button"
              onClick={handleGerarPromptMemoria}
              className="w-full py-3 bg-[#e8ff5a] text-[#0d0d0d] font-bold rounded-xl hover:bg-[#d4eb45] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-[#e8ff5a]/10 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Prompt de Memória Externa</span>
            </button>
          </div>
        </div>

        {/* Painel Direito: Exibição do Prompt Gerado */}
        <div className="lg:col-span-5 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <Terminal className="w-5 h-5 text-[#e8ff5a]" /> Prompt de Memória Gerado
            </h3>

            <button
              type="button"
              onClick={handleCopiar}
              disabled={!promptMemoria}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                copiado 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-[#e8ff5a] text-[#0d0d0d] hover:bg-[#d4eb45] shadow-[#e8ff5a]/10 disabled:opacity-50'
              }`}
            >
              {copiado ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiado ? 'Copiado com Sucesso!' : 'Copiar Tudo'}</span>
            </button>
          </div>

          <div className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-6 relative group flex flex-col justify-center">
            {promptMemoria ? (
              <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-y-auto max-h-[550px] select-all leading-relaxed w-full">
                {promptMemoria}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono text-xs select-none space-y-3">
                <History className="w-12 h-12 text-[#2a2a2a] animate-pulse" />
                <p>Clique em "Gerar Prompt de Memória Externa" no painel ao lado para compilar o histórico recente de sessões e orientar o LLM na retomada do projeto.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
