import React, { useMemo } from 'react';
import { useProjetosStore } from '../store/projetos';
import {
  Map, AlertCircle, ShieldAlert, FileCode, Server, Cpu,
  CheckCircle2, Loader2, Circle, Layers, Activity, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Mapa: React.FC = () => {
  const { projetoAtivo } = useProjetosStore();

  const fasesPorStatus = useMemo(() => {
    if (!projetoAtivo?.fases) return { pendente: [], andamento: [], concluido: [] };
    const ordenadas = [...projetoAtivo.fases].sort((a, b) => a.ordem - b.ordem);
    return {
      pendente: ordenadas.filter(f => f.percentual === 0),
      andamento: ordenadas.filter(f => f.percentual > 0 && f.percentual < 100),
      concluido: ordenadas.filter(f => f.percentual === 100),
    };
  }, [projetoAtivo?.fases]);

  if (!projetoAtivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 animate-fade-in font-sans">
        <AlertCircle className="w-12 h-12 text-yellow-500" />
        <h3 className="text-xl font-bold text-white">Nenhum Projeto Ativo Selecionado</h3>
        <p className="text-sm text-gray-400 font-mono max-w-md">
          Para visualizar o Mapa de Arquitetura, selecione ou crie um projeto no Dashboard.
        </p>
        <Link to="/" className="px-6 py-3 bg-[#e8ff5a] text-[#0d0d0d] font-bold rounded-xl hover:bg-[#d4eb45] transition-all text-xs uppercase tracking-wider shadow-lg shadow-[#e8ff5a]/10">
          Ir para o Dashboard
        </Link>
      </div>
    );
  }

  const colunas = [
    {
      id: 'pendente',
      label: 'Pendente',
      cor: 'text-gray-400',
      borda: 'border-gray-600/30',
      bg: 'bg-gray-500/5',
      icon: <Circle className="w-4 h-4 text-gray-500" />,
      fases: fasesPorStatus.pendente,
    },
    {
      id: 'andamento',
      label: 'Em Andamento',
      cor: 'text-yellow-400',
      borda: 'border-yellow-500/30',
      bg: 'bg-yellow-500/5',
      icon: <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />,
      fases: fasesPorStatus.andamento,
    },
    {
      id: 'concluido',
      label: 'Concluído',
      cor: 'text-green-400',
      borda: 'border-green-500/30',
      bg: 'bg-green-500/5',
      icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,
      fases: fasesPorStatus.concluido,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">
      {/* Cabeçalho */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Map className="w-48 h-48 text-[#e8ff5a]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-[#2a2a2a]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 text-[#e8ff5a] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Map className="w-3.5 h-3.5" /> Visão Arquitetural
              </span>
              <span className="text-xs text-gray-500 font-mono">Projeto: {projetoAtivo.nome}</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Mapa do Projeto</h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Kanban de fases, stack tecnológica e arquivos críticos protegidos.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] text-center min-w-[80px]">
              <div className="text-xs text-gray-500 font-mono mb-1">Progresso</div>
              <div className="text-2xl font-bold text-[#e8ff5a] font-mono">{projetoAtivo.progresso || 0}%</div>
            </div>
            <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] text-center min-w-[80px]">
              <div className="text-xs text-gray-500 font-mono mb-1">Fases</div>
              <div className="text-2xl font-bold text-white font-mono">{projetoAtivo.fases?.length || 0}</div>
            </div>
            <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] text-center min-w-[80px]">
              <div className="text-xs text-gray-500 font-mono mb-1">Erros</div>
              <div className={`text-2xl font-bold font-mono ${(projetoAtivo.erros?.length || 0) > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {projetoAtivo.erros?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Stack Tecnológica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-3">
            <FileCode className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <div className="text-gray-500 text-[10px] uppercase tracking-wider">Frontend</div>
              <div className="text-white font-bold truncate">{projetoAtivo.stack_fe || 'Não definido'}</div>
            </div>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-3">
            <Server className="w-5 h-5 text-green-400 shrink-0" />
            <div>
              <div className="text-gray-500 text-[10px] uppercase tracking-wider">Backend</div>
              <div className="text-white font-bold truncate">{projetoAtivo.stack_be || 'Não definido'}</div>
            </div>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-3">
            <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-gray-500 text-[10px] uppercase tracking-wider">LLM Base</div>
              <div className="text-[#e8ff5a] font-bold truncate">{projetoAtivo.llm_base || 'Gemini Flash'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban de Fases */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl shadow-xl space-y-6">
        <div className="flex items-center gap-2 border-b border-[#2a2a2a] pb-4">
          <Layers className="w-5 h-5 text-[#e8ff5a]" />
          <h2 className="text-xl font-bold text-white">Kanban de Fases</h2>
          <span className="ml-auto text-xs text-gray-500 font-mono">{projetoAtivo.fases?.length || 0} fases no total</span>
        </div>

        {(projetoAtivo.fases?.length || 0) === 0 ? (
          <div className="text-center p-8 text-gray-500 font-mono text-sm border border-[#2a2a2a] rounded-xl bg-[#0d0d0d]">
            Nenhuma fase cadastrada. Acesse o Módulo Roteiro para configurar as fases do projeto.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {colunas.map((col) => (
              <div key={col.id} className={`rounded-2xl border ${col.borda} ${col.bg} p-5 space-y-3 min-h-[200px]`}>
                <div className={`flex items-center gap-2 pb-3 border-b ${col.borda}`}>
                  {col.icon}
                  <span className={`text-xs font-bold font-mono uppercase tracking-wider ${col.cor}`}>{col.label}</span>
                  <span className={`ml-auto text-xs font-mono font-bold ${col.cor}`}>{col.fases.length}</span>
                </div>
                {col.fases.length > 0 ? (
                  col.fases.map((fase, idx) => (
                    <div key={fase.id} className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-4 space-y-2 hover:border-[#3a3a3a] transition-all">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-gray-500 bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#2a2a2a]">
                          FASE {fase.ordem || idx + 1}
                        </span>
                        <span className={`text-xs font-bold font-mono ${col.cor}`}>{fase.percentual}%</span>
                      </div>
                      <p className="text-sm font-semibold text-white font-sans">{fase.nome}</p>
                      <div className="w-full bg-[#2a2a2a] rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            fase.percentual === 100 ? 'bg-green-400' :
                            fase.percentual > 0 ? 'bg-yellow-400' : 'bg-gray-600'
                          }`}
                          style={{ width: `${fase.percentual}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-600 font-mono text-xs">
                    Nenhuma fase aqui
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid Inferior: Arquivos Críticos + Sessões Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Arquivos Críticos Protegidos */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#2a2a2a] pb-4">
            <Lock className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Arquivos Críticos Protegidos</h2>
          </div>
          {(projetoAtivo.arquivos_criticos?.length || 0) > 0 ? (
            <div className="space-y-2">
              {projetoAtivo.arquivos_criticos!.map((arq, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-[#0d0d0d] border border-yellow-500/20 rounded-xl group hover:border-yellow-500/40 transition-all">
                  <ShieldAlert className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span className="text-xs font-mono text-yellow-200 truncate flex-1">{arq}</span>
                  <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded text-[10px] font-mono uppercase shrink-0">Protegido</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 font-mono text-xs border border-[#2a2a2a] rounded-xl bg-[#0d0d0d]">
              Nenhum arquivo crítico configurado.<br />Acesse o Guard Prompt para proteger arquivos.
            </div>
          )}
        </div>

        {/* Últimos Erros Ativos */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#2a2a2a] pb-4">
            <Activity className="w-5 h-5 text-red-400" />
            <h2 className="text-xl font-bold text-white">Erros Ativos</h2>
            <span className={`ml-auto px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
              (projetoAtivo.erros?.length || 0) > 0
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}>
              {projetoAtivo.erros?.length || 0} erros
            </span>
          </div>
          {(projetoAtivo.erros?.length || 0) > 0 ? (
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {projetoAtivo.erros!.slice(0, 6).map((erro, idx) => (
                <div key={idx} className="flex items-start gap-3 px-4 py-3 bg-[#0d0d0d] border border-red-500/20 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px] font-mono uppercase border border-red-500/20">{erro.tipo || 'Geral'}</span>
                      {erro.arquivo && <span className="text-[10px] text-gray-500 font-mono truncate">{erro.arquivo}</span>}
                    </div>
                    <p className="text-xs text-gray-300 font-sans mt-1 line-clamp-2">{erro.descricao}</p>
                  </div>
                </div>
              ))}
              {(projetoAtivo.erros?.length || 0) > 6 && (
                <Link to="/erros" className="block text-center text-xs text-[#e8ff5a] font-mono py-2 hover:underline">
                  + {(projetoAtivo.erros?.length || 0) - 6} erros restantes → Ver todos
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-green-400 font-mono text-xs border border-green-500/20 rounded-xl bg-green-500/5 flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8" />
              Nenhum erro ativo. Sistema estável!
            </div>
          )}
        </div>
      </div>

      {/* Regras Especiais / Guard Prompt */}
      {projetoAtivo.regras_especiais && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-[#2a2a2a] pb-4">
            <ShieldAlert className="w-5 h-5 text-[#e8ff5a]" />
            <h2 className="text-xl font-bold text-white">Lei Primordial / Regras do Guard Prompt</h2>
          </div>
          <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed bg-[#0d0d0d] border border-[#2a2a2a] p-6 rounded-xl max-h-[200px] overflow-y-auto">
            {projetoAtivo.regras_especiais}
          </pre>
        </div>
      )}
    </div>
  );
};
