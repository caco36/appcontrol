import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjetosStore } from '../store/projetos';
import { 
  FolderKanban, Calendar, Activity, ArrowLeft, Sparkles, 
  Terminal, ShieldCheck, FileCode, Server, Cpu, CheckCircle2, AlertCircle, Loader2, Save 
} from 'lucide-react';
import { Fase } from '../types';

export const ProjetoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projetoAtivo, loading, erro, selecionarProjeto, atualizarFases, atualizarFaseUnica } = useProjetosStore();
  const [fasesLocais, setFasesLocais] = useState<Fase[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      selecionarProjeto(id);
    }
  }, [id, selecionarProjeto]);

  useEffect(() => {
    if (projetoAtivo?.fases) {
      setFasesLocais(projetoAtivo.fases);
    }
  }, [projetoAtivo]);

  if (loading && !projetoAtivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-[#e8ff5a] animate-spin" />
        <p className="text-sm text-gray-400 font-mono">Carregando detalhes do projeto...</p>
      </div>
    );
  }

  if (!projetoAtivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-xl font-bold text-white">Projeto não encontrado</h3>
        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-3 bg-[#e8ff5a] text-black font-bold rounded-xl text-xs uppercase tracking-wider mt-2"
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const handleSliderChange = (faseId: string, valor: number) => {
    setFasesLocais(prev => prev.map(f => f.id === faseId ? { ...f, percentual: valor } : f));
  };

  const handleSalvarFase = async (faseId: string, valor: number) => {
    setSalvando(true);
    setSucesso(null);
    try {
      await atualizarFaseUnica(faseId, valor);
      setSucesso('Fase atualizada com sucesso!');
      setTimeout(() => setSucesso(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvarTudo = async () => {
    setSalvando(true);
    setSucesso(null);
    try {
      const payload = fasesLocais.map(f => ({ id: f.id, percentual: f.percentual }));
      await atualizarFases(payload);
      setSucesso('Roadmap completo salvo com sucesso!');
      setTimeout(() => setSucesso(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">
      {/* Botão Voltar */}
      <button 
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-sm font-mono text-gray-400 hover:text-[#e8ff5a] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar para Meus Projetos
      </button>

      {/* Cabeçalho do Projeto */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <FolderKanban className="w-48 h-48 text-[#e8ff5a]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-[#2a2a2a]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 text-[#e8ff5a] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Projeto Ativo
              </span>
              <span className="text-xs text-gray-500 font-mono">ID: {projetoAtivo.id}</span>
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              {projetoAtivo.nome}
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#e8ff5a]" /> {projetoAtivo.tipo}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a]">
            <Activity className="w-8 h-8 text-[#e8ff5a]" />
            <div>
              <div className="text-xs text-gray-400 font-mono">Progresso Geral</div>
              <div className="text-2xl font-bold text-[#e8ff5a] font-mono">{projetoAtivo.progresso || 0}%</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] space-y-2.5">
            <div className="text-gray-400 flex items-center gap-2 font-sans font-semibold">
              <FileCode className="w-4 h-4 text-blue-400" /> Stack Frontend
            </div>
            <div className="text-white font-bold">{projetoAtivo.stack_fe || 'Não definida'}</div>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] space-y-2.5">
            <div className="text-gray-400 flex items-center gap-2 font-sans font-semibold">
              <Server className="w-4 h-4 text-green-400" /> Stack Backend
            </div>
            <div className="text-white font-bold">{projetoAtivo.stack_be || 'Não definida'}</div>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] space-y-2.5">
            <div className="text-gray-400 flex items-center gap-2 font-sans font-semibold">
              <Cpu className="w-4 h-4 text-purple-400" /> IA Base (LLM)
            </div>
            <div className="text-white font-bold">{projetoAtivo.llm_base || 'Gemini (Flash)'}</div>
          </div>
        </div>

        {/* Arquivos Críticos e Regras */}
        <div className="mt-6 pt-6 border-t border-[#2a2a2a] grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-yellow-400" /> Arquivos Críticos Protegidos
            </h4>
            <div className="flex flex-wrap gap-2">
              {projetoAtivo.arquivos_criticos?.length > 0 ? (
                projetoAtivo.arquivos_criticos.map((arq, idx) => (
                  <span key={idx} className="px-3 py-1 bg-[#0d0d0d] border border-[#2a2a2a] text-yellow-300 rounded-lg font-mono text-xs">
                    {arq}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 font-mono text-xs">Nenhum arquivo crítico cadastrado.</span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#e8ff5a]" /> Regras Especiais / Prompt Guard
            </h4>
            <div className="p-4 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-gray-300 font-mono text-xs whitespace-pre-line">
              {projetoAtivo.regras_especiais || 'Nenhuma regra especial cadastrada.'}
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

      {sucesso && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <span>{sucesso}</span>
        </div>
      )}

      {/* Sliders Interativos de Roadmap (Fases de 0 a 5) */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#e8ff5a]" /> Roadmap Interativo (Fases 0 a 5)
            </h3>
            <p className="text-xs text-gray-400 mt-1 font-mono">Ajuste o progresso de cada fase para calibrar o contexto da IA</p>
          </div>

          <button 
            onClick={handleSalvarTudo}
            disabled={salvando}
            className="flex items-center gap-2 px-6 py-3 bg-[#e8ff5a] text-black font-bold rounded-xl hover:bg-[#d4eb4b] transition-all shadow-lg shadow-[#e8ff5a]/10 disabled:opacity-50 text-xs uppercase tracking-wider cursor-pointer"
          >
            {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Salvar Todo o Roadmap</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {fasesLocais.map((fase) => (
            <div key={fase.id} className="bg-[#0d0d0d] border border-[#2a2a2a] p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#e8ff5a]" /> {fase.nome}
                </span>
                <span className="px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#e8ff5a] font-mono text-xs font-bold">
                  {fase.percentual}%
                </span>
              </div>

              <input 
                type="range"
                min="0"
                max="100"
                value={fase.percentual}
                onChange={(e) => handleSliderChange(fase.id, Number(e.target.value))}
                className="w-full accent-[#e8ff5a] bg-[#2a2a2a] h-2 rounded-lg appearance-none cursor-pointer"
              />

              <div className="flex items-center justify-between pt-2 border-t border-[#2a2a2a]/60 text-xs font-mono">
                <span className="text-gray-500">Ordem: {fase.ordem}</span>
                <button 
                  onClick={() => handleSalvarFase(fase.id, fase.percentual)}
                  disabled={salvando}
                  className="text-[#e8ff5a] hover:underline font-semibold flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                >
                  Salvar Fase
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico de Sessões do Projeto */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#e8ff5a]" /> Histórico de Sessões ({projetoAtivo.sessoes?.length || 0})
          </h3>
          <span className="text-xs text-gray-500 font-mono">Registros cumulativos da IA</span>
        </div>

        {projetoAtivo.sessoes?.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-mono text-sm border border-[#2a2a2a]/60 rounded-xl bg-[#0d0d0d]">
            Nenhuma sessão registrada para este projeto ainda. Utilize o Módulo Extrator na Etapa 3 para registrar sessões de IA.
          </div>
        ) : (
          <div className="space-y-4">
            {projetoAtivo.sessoes?.map((sessao) => (
              <div key={sessao.id} className="bg-[#0d0d0d] border border-[#2a2a2a] p-5 rounded-xl flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider ${
                      sessao.status === 'sucesso' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      sessao.status === 'parcial' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {sessao.status}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{new Date(sessao.data || '').toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-300 font-sans">{sessao.resumo || 'Sessão sem resumo.'}</p>
                </div>
                <span className="px-2.5 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs font-mono text-gray-400 uppercase">
                  Fonte: {sessao.fonte}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
