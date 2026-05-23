import React, { useState, useEffect } from 'react';
import { useProjetosStore } from '../store/projetos';
import { 
  FileText, Sparkles, Copy, CheckCircle2, AlertCircle, 
  Loader2, RefreshCw, Terminal, Layers, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { downloadMarkdown } from '../utils/nomenclatura';

export const Roteiro: React.FC = () => {
  const { projetoAtivo, atualizarFaseUnica, erro } = useProjetosStore();

  const [fasesLocais, setFasesLocais] = useState<{ id: string; nome: string; ordem: number; percentual: number }[]>([]);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

  const [roteiroGerado, setRoteiroGerado] = useState<string>('');
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (projetoAtivo?.fases) {
      // Ordena por ordem crescente
      const ordenadas = [...projetoAtivo.fases].sort((a, b) => a.ordem - b.ordem);
      setFasesLocais(ordenadas);
    } else {
      setFasesLocais([]);
    }
  }, [projetoAtivo]);

  const handlePercentualChange = (id: string, novoValor: number) => {
    setFasesLocais(fasesLocais.map(f => f.id === id ? { ...f, percentual: novoValor } : f));
  };

  const handleSalvarFase = async (faseId: string, percentual: number) => {
    setAtualizandoId(faseId);
    try {
      await atualizarFaseUnica(faseId, percentual);
    } catch (err) {
      console.error(err);
    } finally {
      setAtualizandoId(null);
    }
  };

  const handleGerarPromptRoteiro = () => {
    if (!projetoAtivo) return;

    const fasesFormatadas = fasesLocais.map((f, i) => {
      const status = f.percentual === 100 ? 'CONCLUÍDO' : f.percentual > 0 ? `EM ANDAMENTO (${f.percentual}%)` : 'PENDENTE (0%)';
      return `Fase ${i + 1}: ${f.nome} — [${status}]`;
    }).join('\n');

    const prompt = `[AppControl v2.0 — Roteiro de Execução / Roadmap Ativo]
PROJETO ATIVO: ${projetoAtivo.nome}
TIPO: ${projetoAtivo.tipo}
PROGRESSO GERAL: ${projetoAtivo.progresso || 0}%

================================================================================
ESTADO ATUAL DO ROADMAP (FASES DE DESENVOLVIMENTO)
================================================================================
${fasesFormatadas}

================================================================================
INSTRUÇÕES E PROTOCOLO PARA A IA (SESSÃO ATUAL)
================================================================================
1. Analise o status de cada fase acima para compreender em que ponto do ciclo de vida o projeto se encontra.
2. Priorize a conclusão das fases que estão 'EM ANDAMENTO' antes de sugerir pular para fases futuras.
3. Certifique-se de que todas as dependências arquiteturais das fases anteriores foram plenamente validadas.
4. Mantenha o foco estrito nas metas da fase atual em execução, evitando dispersão de escopo.`;

    setRoteiroGerado(prompt);
  };

  const handleCopiar = () => {
    if (!roteiroGerado) return;
    navigator.clipboard.writeText(roteiroGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  if (!projetoAtivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 animate-fade-in font-sans">
        <AlertCircle className="w-12 h-12 text-yellow-500" />
        <h3 className="text-xl font-bold text-white">Nenhum Projeto Ativo Selecionado</h3>
        <p className="text-sm text-gray-400 font-mono max-w-md">
          Para visualizar e gerenciar o Roteiro de Execução (Roadmap), selecione ou crie um projeto no Dashboard ou na Sidebar.
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
          <FileText className="w-48 h-48 text-[#e8ff5a]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-[#2a2a2a]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 text-[#e8ff5a] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Roadmap Ativo
              </span>
              <span className="text-xs text-gray-500 font-mono">Projeto: {projetoAtivo.nome}</span>
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Módulo Roteiro de Execução
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Gerencie as fases do ciclo de desenvolvimento e gere o prompt de alinhamento global para a IA.
            </p>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-4">
            <Layers className="w-8 h-8 text-[#e8ff5a]" />
            <div>
              <div className="text-xs text-gray-400 font-mono">Progresso Global</div>
              <div className="text-sm font-bold text-[#e8ff5a] font-mono">{projetoAtivo.progresso || 0}% Concluído</div>
            </div>
          </div>
        </div>
      </div>

      {erro && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{erro}</span>
        </div>
      )}

      {/* Grid Gestão de Fases e Exibição do Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Painel de Gestão das Fases */}
        <div className="lg:col-span-6 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <Layers className="w-5 h-5 text-[#e8ff5a]" /> Fases do Projeto
            </h3>
            <span className="text-xs text-gray-400 font-mono">Ajuste o progresso de cada fase</span>
          </div>

          <div className="space-y-4">
            {fasesLocais.length > 0 ? (
              fasesLocais.map((fase, index) => (
                <div key={fase.id} className="p-5 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl space-y-4 group hover:border-[#3a3a3a] transition-all">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-[#2a2a2a] text-white flex items-center justify-center text-xs font-bold font-mono shrink-0">
                        {index + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate">{fase.nome}</h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono font-bold text-[#e8ff5a]">
                        {fase.percentual}%
                      </span>
                    </div>
                  </div>

                  {/* Slider de Progresso */}
                  <div className="flex items-center gap-4 pt-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={fase.percentual}
                      onChange={(e) => handlePercentualChange(fase.id, parseInt(e.target.value))}
                      className="flex-1 h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#e8ff5a]"
                    />

                    <button
                      type="button"
                      onClick={() => handleSalvarFase(fase.id, fase.percentual)}
                      disabled={atualizandoId === fase.id}
                      className="px-3 py-1.5 bg-[#2a2a2a] text-white hover:bg-[#e8ff5a] hover:text-[#0d0d0d] rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {atualizandoId === fase.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      <span>Salvar</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-gray-500 font-mono text-xs">
                Nenhuma fase cadastrada para este projeto.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#2a2a2a]">
            <button
              type="button"
              onClick={handleGerarPromptRoteiro}
              className="w-full py-3 bg-[#e8ff5a] text-[#0d0d0d] font-bold rounded-xl hover:bg-[#d4eb45] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-[#e8ff5a]/10 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Prompt do Roteiro</span>
            </button>
          </div>
        </div>

        {/* Área de Exibição do Prompt Gerado */}
        <div className="lg:col-span-6 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <Terminal className="w-5 h-5 text-[#e8ff5a]" /> Prompt de Roteiro Gerado
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => projetoAtivo && downloadMarkdown('roteiro', projetoAtivo.nome, roteiroGerado)}
                disabled={!roteiroGerado}
                className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all border border-[#e8ff5a]/30 text-[#e8ff5a] bg-[#e8ff5a]/10 hover:bg-[#e8ff5a] hover:text-[#0d0d0d] disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Baixar .md
              </button>
              <button
                type="button"
                onClick={handleCopiar}
                disabled={!roteiroGerado}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                  copiado 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-[#e8ff5a] text-[#0d0d0d] hover:bg-[#d4eb45] shadow-[#e8ff5a]/10 disabled:opacity-50'
                }`}
              >
                {copiado ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-6 relative group flex flex-col justify-center">
            {roteiroGerado ? (
              <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-y-auto max-h-[550px] select-all leading-relaxed w-full">
                {roteiroGerado}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono text-xs select-none space-y-3">
                <FileText className="w-12 h-12 text-[#2a2a2a] animate-pulse" />
                <p>Clique em "Gerar Prompt do Roteiro" no painel ao lado para compilar a sequência de desenvolvimento e o status atual do projeto.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
