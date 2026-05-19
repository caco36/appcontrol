import React, { useState, useMemo } from 'react';
import { useProjetosStore } from '../store/projetos';
import { 
  AlertOctagon, Sparkles, Copy, CheckCircle2, AlertCircle, 
  Search, Filter, Terminal, FileCode, CheckSquare, Square, ArrowRight, Bug
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Erros: React.FC = () => {
  const { projetoAtivo } = useProjetosStore();

  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [selecionados, setSelecionados] = useState<string[]>([]);

  const [promptCorrecao, setPromptCorrecao] = useState<string>('');
  const [copiado, setCopiado] = useState(false);

  // Extrai tipos únicos de erro para o select de filtro
  const tiposDisponiveis = useMemo(() => {
    if (!projetoAtivo?.erros) return [];
    const tipos = projetoAtivo.erros.map(e => e.tipo).filter(Boolean);
    return Array.from(new Set(tipos));
  }, [projetoAtivo?.erros]);

  const errosFiltrados = useMemo(() => {
    if (!projetoAtivo?.erros) return [];

    return projetoAtivo.erros.filter(erro => {
      const matchTipo = filtroTipo === 'todos' || erro.tipo === filtroTipo;
      const matchBusca = busca === '' || (
        (erro.descricao?.toLowerCase().includes(busca.toLowerCase())) ||
        (erro.arquivo?.toLowerCase().includes(busca.toLowerCase())) ||
        (erro.tipo?.toLowerCase().includes(busca.toLowerCase()))
      );
      return matchTipo && matchBusca;
    });
  }, [projetoAtivo?.erros, filtroTipo, busca]);

  const toggleSelecionar = (id: string) => {
    setSelecionados(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selecionarTodos = () => {
    if (errosFiltrados.length === selecionados.length) {
      setSelecionados([]);
    } else {
      setSelecionados(errosFiltrados.map(e => e.id));
    }
  };

  const handleGerarPromptCorrecao = () => {
    if (!projetoAtivo?.erros) return;

    const listaErrosAlvo = selecionados.length > 0 
      ? projetoAtivo.erros.filter(e => selecionados.includes(e.id))
      : errosFiltrados;

    if (listaErrosAlvo.length === 0) return;

    const errosFormatados = listaErrosAlvo.map((e, idx) => {
      return `[Erro #${idx + 1} — Tipo: ${e.tipo || 'Geral'} — Arquivo de Origem: ${e.arquivo || 'Desconhecido'}]
DATA DE REGISTRO: ${e.data ? new Date(e.data).toLocaleString() : 'N/A'}
DESCRIÇÃO DO PROBLEMA / STACK TRACE:
${e.descricao || 'Sem descrição detalhada'}

SOLUÇÃO PROPOSTA / STATUS ATUAL:
${e.solucao || 'Nenhuma solução cadastrada ainda'}
--------------------------------------------------------------------------------`;
    }).join('\n\n');

    const prompt = `[AppControl v1.0 — Diagnóstico de Falhas e Resolução de Erros]
PROJETO ATIVO: ${projetoAtivo.nome}
TIPO: ${projetoAtivo.tipo}
STACK FRONTEND: ${projetoAtivo.stack_fe || 'N/A'}
STACK BACKEND: ${projetoAtivo.stack_be || 'N/A'}

================================================================================
OBJETIVO DESTE PROMPT DE CORREÇÃO
================================================================================
Você atuará como um Engenheiro de Confiabilidade de Site (SRE) e Desenvolvedor Sênior. Analise a lista de falhas/erros abaixo e forneça um plano de correção definitivo, detalhando a causa raiz provável e o código exato para solucionar o problema.

================================================================================
LISTA DE ERROS SELECIONADOS PARA ANÁLISE
================================================================================
${errosFormatados}

================================================================================
DIRETRIZES PARA A RESPOSTA DA IA
================================================================================
1. Para cada erro listado, identifique a causa raiz com base nas stacks do projeto.
2. Forneça o snippet de código corrigido com instruções claras de onde aplicá-lo.
3. Se o erro envolver dependências ou configurações de ambiente, especifique os comandos exatos de terminal necessários.
4. Mantenha o código limpo, tipado e alinhado com a arquitetura do projeto.`;

    setPromptCorrecao(prompt);
  };

  const handleCopiar = () => {
    if (!promptCorrecao) return;
    navigator.clipboard.writeText(promptCorrecao);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  if (!projetoAtivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 animate-fade-in font-sans">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-xl font-bold text-white">Nenhum Projeto Ativo Selecionado</h3>
        <p className="text-sm text-gray-400 font-mono max-w-md">
          Para visualizar, filtrar e gerenciar os Erros do sistema, selecione ou crie um projeto no Dashboard ou na Sidebar.
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
          <Bug className="w-48 h-48 text-[#e8ff5a]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-[#2a2a2a]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5" /> Log de Incidentes
              </span>
              <span className="text-xs text-gray-500 font-mono">Projeto: {projetoAtivo.nome}</span>
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Módulo Log de Erros
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Gerencie falhas, filtre por tipo/arquivo e gere o prompt de correção avançado para o LLM.
            </p>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-4">
            <Bug className="w-8 h-8 text-red-500" />
            <div>
              <div className="text-xs text-gray-400 font-mono">Erros Registrados</div>
              <div className="text-sm font-bold text-red-400 font-mono">{projetoAtivo.erros?.length || 0} Falhas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal: Listagem de Erros e Exibição do Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Painel Esquerdo: Listagem e Filtros */}
        <div className="lg:col-span-7 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2a2a2a] pb-6">
            {/* Barra de Busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar por descrição, arquivo ou tipo..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#e8ff5a]/50 transition-colors font-sans"
              />
            </div>

            {/* Filtro de Tipo */}
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="bg-[#0d0d0d] border border-[#2a2a2a] text-white text-xs font-mono rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#e8ff5a]/50 transition-colors cursor-pointer"
              >
                <option value="todos">Todos os Tipos</option>
                {tiposDisponiveis.map((tipo, idx) => (
                  <option key={idx} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cabeçalho de Seleção em Lote */}
          <div className="flex items-center justify-between px-2 text-xs font-mono text-gray-400">
            <button 
              type="button" 
              onClick={selecionarTodos}
              className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
            >
              {errosFiltrados.length > 0 && errosFiltrados.length === selecionados.length ? (
                <CheckSquare className="w-4 h-4 text-[#e8ff5a]" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>Selecionar Todos ({errosFiltrados.length})</span>
            </button>
            <span>{selecionados.length} selecionado(s)</span>
          </div>

          {/* Lista de Erros */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {errosFiltrados.length > 0 ? (
              errosFiltrados.map((erro) => {
                const isSelected = selecionados.includes(erro.id);
                return (
                  <div 
                    key={erro.id} 
                    onClick={() => toggleSelecionar(erro.id)}
                    className={`bg-[#0d0d0d] border p-5 rounded-xl transition-all cursor-pointer select-none group flex items-start gap-4 ${
                      isSelected 
                        ? 'border-[#e8ff5a] bg-[#e8ff5a]/5' 
                        : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
                    }`}
                  >
                    <div className="mt-1 shrink-0">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-[#e8ff5a]" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-500 group-hover:text-gray-400" />
                      )}
                    </div>

                    <div className="space-y-3 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-2.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
                          {erro.tipo || 'Geral'}
                        </span>
                        <span className="text-xs text-gray-400 font-mono flex items-center gap-1 bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#2a2a2a]">
                          <FileCode className="w-3 h-3 text-[#e8ff5a]" /> {erro.arquivo || 'Arquivo desconhecido'}
                        </span>
                        <span className="text-xs text-gray-500 font-mono ml-auto">
                          {erro.data ? new Date(erro.data).toLocaleString() : 'Data não informada'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">Descrição do Problema</h5>
                        <p className="text-sm font-semibold text-gray-200 font-sans whitespace-pre-line bg-[#1a1a1a] p-3 rounded-lg border border-[#2a2a2a]/60">
                          {erro.descricao || 'Sem descrição.'}
                        </p>
                      </div>

                      {erro.solucao && (
                        <div className="space-y-1 pt-1">
                          <h5 className="text-xs font-bold text-[#e8ff5a] uppercase tracking-wider font-mono flex items-center gap-1">
                            <ArrowRight className="w-3.5 h-3.5" /> Solução Proposta / Status
                          </h5>
                          <p className="text-xs text-gray-300 font-sans bg-[#e8ff5a]/5 p-3 rounded-lg border border-[#e8ff5a]/20">
                            {erro.solucao}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-8 text-gray-500 font-mono text-xs border border-[#2a2a2a] rounded-xl bg-[#0d0d0d]">
                Nenhum erro encontrado com os filtros atuais.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#2a2a2a]">
            <button
              type="button"
              onClick={handleGerarPromptCorrecao}
              disabled={errosFiltrados.length === 0}
              className="w-full py-3 bg-[#e8ff5a] text-[#0d0d0d] font-bold rounded-xl hover:bg-[#d4eb45] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-[#e8ff5a]/10 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                Gerar Prompt de Correção ({selecionados.length > 0 ? selecionados.length : errosFiltrados.length} Erros)
              </span>
            </button>
          </div>
        </div>

        {/* Painel Direito: Exibição do Prompt Gerado */}
        <div className="lg:col-span-5 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <Terminal className="w-5 h-5 text-[#e8ff5a]" /> Prompt de Correção Gerado
            </h3>

            <button
              type="button"
              onClick={handleCopiar}
              disabled={!promptCorrecao}
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
            {promptCorrecao ? (
              <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-y-auto max-h-[550px] select-all leading-relaxed w-full">
                {promptCorrecao}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono text-xs select-none space-y-3">
                <Bug className="w-12 h-12 text-[#2a2a2a] animate-pulse" />
                <p>Selecione os erros no painel ao lado e clique em "Gerar Prompt de Correção" para criar um plano de diagnóstico e resolução de problemas para a IA.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
