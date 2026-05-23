import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjetosStore } from '../store/projetos';
import { 
  FolderKanban, Calendar, Activity, ArrowLeft, Sparkles, 
  Terminal, ShieldCheck, FileCode, Server, Cpu, CheckCircle2, AlertCircle, Loader2, Save, Download
} from 'lucide-react';
import { Fase } from '../types';
import { projetosService } from '../services/projetos';
import { downloadMarkdown } from '../utils/nomenclatura';

export const ProjetoDetalhe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projetoAtivo, loading, erro, selecionarProjeto, atualizarFases, atualizarFaseUnica } = useProjetosStore();
  const [fasesLocais, setFasesLocais] = useState<Fase[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Estados para Edição do Projeto
  const [editando, setEditando] = useState(false);
  const [nomeEdit, setNomeEdit] = useState('');
  const [tipoEdit, setTipoEdit] = useState('');
  const [stackFeEdit, setStackFeEdit] = useState('');
  const [stackBeEdit, setStackBeEdit] = useState('');
  const [llmBaseEdit, setLlmBaseEdit] = useState('Gemini (Flash)');
  const [antigravityPathEdit, setAntigravityPathEdit] = useState('');
  const [arquivosCriticosEdit, setArquivosCriticosEdit] = useState('');
  const [regrasEspeciaisEdit, setRegrasEspeciaisEdit] = useState('');

  // Estados para Sincronização do Antigravity
  const [sincronizando, setSincronizando] = useState(false);
  const [erroSync, setErroSync] = useState<string | null>(null);
  const [resultadoSync, setResultadoSync] = useState<{
    status_geral: string;
    resumo: string;
    fases_progresso: { ordem: number; percentual: number }[];
    o_que_foi_feito: string[];
    o_que_nao_foi_feito: string[];
    erros_identificados: string[];
    proximos_passos: string[];
    relatorio_markdown?: string;
  } | null>(null);

  // Estados para Validador de Entrega
  const [escopoPedido, setEscopoPedido] = useState('');
  const [IAEntregue, setIAEntregue] = useState('');
  const [validandoEntrega, setValidandoEntrega] = useState(false);
  const [resultadoAuditoria, setResultadoAuditoria] = useState<any | null>(null);

  // Estados para Painel de Saúde do Projeto
  const [saude, setSaude] = useState<any | null>(null);
  const [_carregandoSaude, setCarregandoSaude] = useState(false);

  const handleSincronizar = async () => {
    if (!id) return;
    setSincronizando(true);
    setErroSync(null);
    setResultadoSync(null);
    try {
      const resultado = await projetosService.sincronizarAntigravity(id);
      setResultadoSync(resultado);
      setSucesso('Sincronização com Antigravity concluída com sucesso!');
      setTimeout(() => setSucesso(null), 3000);
      await selecionarProjeto(id);
    } catch (e: any) {
      console.error(e);
      setErroSync(e.response?.data?.detail || 'Erro na sincronização com o Antigravity. Certifique-se de que os arquivos do Antigravity existem.');
    } finally {
      setSincronizando(false);
    }
  };

  const handleDownloadRelatorio = () => {
    if (!resultadoSync || !projetoAtivo) return;
    downloadMarkdown('relatorio', projetoAtivo.nome, resultadoSync.relatorio_markdown || '');
  };

  const handleSalvarConfiguracoes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSalvando(true);
    setSucesso(null);
    try {
      const { atualizarProjeto } = useProjetosStore.getState();
      const arquivosLista = arquivosCriticosEdit
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0);

      await atualizarProjeto(id, {
        nome: nomeEdit,
        tipo: tipoEdit,
        stack_fe: stackFeEdit || undefined,
        stack_be: stackBeEdit || undefined,
        llm_base: llmBaseEdit || undefined,
        antigravity_path: antigravityPathEdit,
        arquivos_criticos: arquivosLista,
        regras_especiais: regrasEspeciaisEdit || undefined,
      });
      setSucesso('✅ Configurações do projeto salvas com sucesso!');
      setTimeout(() => setSucesso(null), 3000);
      setEditando(false);
      await selecionarProjeto(id);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

  const handleValidarEntrega = async () => {
    if (!id || !escopoPedido.trim() || !IAEntregue.trim()) return;
    setValidandoEntrega(true);
    setResultadoAuditoria(null);
    try {
      const res = await projetosService.validarEntrega(id, escopoPedido, IAEntregue);
      setResultadoAuditoria(res);
      setSucesso('Auditoria de escopo concluída!');
      setTimeout(() => setSucesso(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setValidandoEntrega(false);
    }
  };

  useEffect(() => {
    if (id) {
      selecionarProjeto(id);
    }
  }, [id, selecionarProjeto]);

  useEffect(() => {
    const carregarSaude = async () => {
      if (!id) return;
      setCarregandoSaude(true);
      try {
        const res = await projetosService.obterSaude(id);
        setSaude(res);
      } catch (e) {
        console.error(e);
      } finally {
        setCarregandoSaude(false);
      }
    };
    if (id) {
      carregarSaude();
    }
  }, [id, projetoAtivo]);

  useEffect(() => {
    if (projetoAtivo) {
      setFasesLocais(projetoAtivo.fases || []);
      setNomeEdit(projetoAtivo.nome || '');
      setTipoEdit(projetoAtivo.tipo || '');
      setStackFeEdit(projetoAtivo.stack_fe || '');
      setStackBeEdit(projetoAtivo.stack_be || '');
      setLlmBaseEdit(projetoAtivo.llm_base || 'Gemini (Flash)');
      setAntigravityPathEdit(projetoAtivo.antigravity_path || '');
      setArquivosCriticosEdit(projetoAtivo.arquivos_criticos?.join(', ') || '');
      setRegrasEspeciaisEdit(projetoAtivo.regras_especiais || '');
    }
  }, [projetoAtivo]);

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

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleSincronizar}
              disabled={sincronizando}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 text-xs uppercase tracking-wider cursor-pointer font-mono"
            >
              {sincronizando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span>Sincronizar Antigravity</span>
                </>
              )}
            </button>

            <button
              onClick={() => setEditando(!editando)}
              className="w-full sm:w-auto px-5 py-3.5 border border-[#2a2a2a] hover:border-[#e8ff5a]/50 text-xs font-mono font-bold uppercase rounded-xl transition-all hover:bg-[#e8ff5a]/10 hover:text-[#e8ff5a] cursor-pointer"
            >
              {editando ? 'Cancelar Edição' : '📝 Editar Projeto'}
            </button>

            <div className="flex items-center gap-4 bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] w-full sm:w-auto">
              <Activity className="w-8 h-8 text-[#e8ff5a]" />
              <div>
                <div className="text-xs text-gray-400 font-mono">Progresso Geral</div>
                <div className="text-2xl font-bold text-[#e8ff5a] font-mono">{projetoAtivo.progresso || 0}%</div>
              </div>
            </div>
          </div>
        </div>

        {editando ? (
          <form onSubmit={handleSalvarConfiguracoes} className="space-y-4 font-mono text-xs text-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-400">Nome do Projeto</label>
                <input 
                  type="text"
                  value={nomeEdit}
                  onChange={(e) => setNomeEdit(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#e8ff5a] transition-colors"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400">Tipo / Domínio</label>
                <input 
                  type="text"
                  value={tipoEdit}
                  onChange={(e) => setTipoEdit(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#e8ff5a] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-gray-400">Stack Frontend</label>
                <input 
                  type="text"
                  value={stackFeEdit}
                  onChange={(e) => setStackFeEdit(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#e8ff5a] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400">Stack Backend</label>
                <input 
                  type="text"
                  value={stackBeEdit}
                  onChange={(e) => setStackBeEdit(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#e8ff5a] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400">IA Base (LLM)</label>
                <input 
                  type="text"
                  value={llmBaseEdit}
                  onChange={(e) => setLlmBaseEdit(e.target.value)}
                  className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#e8ff5a] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400">Caminho da pasta do Antigravity</label>
              <input 
                type="text"
                value={antigravityPathEdit}
                onChange={(e) => setAntigravityPathEdit(e.target.value)}
                placeholder="Ex: C:\Users\hazim\.gemini\antigravity\brain\5ad0e187-e028-499c-ac37-5a230a6c4586"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#e8ff5a] transition-colors"
              />
              <p className="text-[10px] text-gray-500 font-mono">Local onde o agente Antigravity salva walkthrough.md e task.md.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-yellow-400" /> Arquivos Críticos (Separados por vírgula)
              </label>
              <input 
                type="text"
                value={arquivosCriticosEdit}
                onChange={(e) => setArquivosCriticosEdit(e.target.value)}
                placeholder="Ex: auth_service.py, App.tsx, schema.sql"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors"
              />
              <p className="text-[10px] text-gray-500 font-mono">Arquivos protegidos contra deleção ou refatoração pesada.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-400">Regras Especiais / Prompt Guard</label>
              <textarea 
                value={regrasEspeciaisEdit}
                onChange={(e) => setRegrasEspeciaisEdit(e.target.value)}
                rows={3}
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#e8ff5a] transition-colors resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="px-4 py-2 border border-[#2a2a2a] text-gray-300 rounded-lg hover:bg-[#2a2a2a] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-4 py-2 bg-[#e8ff5a] text-[#0d0d0d] font-bold rounded-lg hover:bg-[#d4eb45] transition-all disabled:opacity-50 cursor-pointer"
              >
                Salvar Configurações
              </button>
            </div>
          </form>
        ) : (
          <>
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
          </>
        )}

      </div>

      {erro && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{erro}</span>
        </div>
      )}

      {erroSync && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold">Erro de Sincronização</h5>
            <p className="font-mono text-xs">{erroSync}</p>
          </div>
        </div>
      )}

      {sucesso && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <span>{sucesso}</span>
        </div>
      )}

      {/* Painel de Resultados da Sincronização */}
      {resultadoSync && (
        <div className="bg-[#111111]/90 backdrop-blur-md border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Sparkles className="w-24 h-24 text-blue-500 animate-pulse" />
          </div>

          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" /> Relatório de Sincronização do Antigravity
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-mono">Análise em tempo real do progresso gerado pela IA</p>
            </div>
            
            <div className="flex items-center gap-2">
              {resultadoSync.relatorio_markdown && (
                <button 
                  onClick={handleDownloadRelatorio}
                  className="text-xs text-[#e8ff5a] hover:text-[#0d0d0d] font-mono border border-[#e8ff5a]/30 hover:bg-[#e8ff5a] px-3 py-1.5 rounded-lg bg-[#e8ff5a]/10 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Baixar Relatório
                </button>
              )}
              <button 
                onClick={() => setResultadoSync(null)}
                className="text-xs text-gray-400 hover:text-white font-mono border border-[#2a2a2a] px-3 py-1.5 rounded-lg bg-[#0d0d0d] transition-colors cursor-pointer"
              >
                Fechar Painel
              </button>
            </div>
          </div>

          {/* Status Geral e Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#0d0d0d] p-5 rounded-xl border border-[#2a2a2a] flex flex-col justify-between">
              <div className="text-xs text-gray-400 font-mono">Status Geral do Projeto</div>
              <div className="mt-2">
                <span className={`px-3.5 py-1.5 rounded-lg text-sm font-mono font-bold uppercase tracking-wider inline-block ${
                  resultadoSync.status_geral === 'sucesso' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                  resultadoSync.status_geral === 'parcial' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {resultadoSync.status_geral}
                </span>
              </div>
            </div>

            <div className="bg-[#0d0d0d] p-5 rounded-xl border border-[#2a2a2a] md:col-span-3">
              <div className="text-xs text-gray-400 font-mono mb-2">Resumo Executivo do Antigravity</div>
              <p className="text-sm text-gray-300 font-sans leading-relaxed">{resultadoSync.resumo}</p>
            </div>
          </div>

          {/* Grid de Cards Coloridos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feito (Verde) */}
            <div className="bg-green-500/5 border border-green-500/10 p-6 rounded-xl space-y-4">
              <h4 className="text-sm font-bold text-green-400 flex items-center gap-2 uppercase tracking-wider font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> O que foi feito
              </h4>
              {resultadoSync.o_que_foi_feito.length === 0 ? (
                <p className="text-xs text-gray-500 font-mono">Nenhum item relatado.</p>
              ) : (
                <ul className="space-y-2.5 text-xs text-gray-300 font-mono list-disc list-inside">
                  {resultadoSync.o_que_foi_feito.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Pendente (Amarelo) */}
            <div className="bg-yellow-500/5 border border-yellow-500/10 p-6 rounded-xl space-y-4">
              <h4 className="text-sm font-bold text-yellow-400 flex items-center gap-2 uppercase tracking-wider font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> O que está pendente
              </h4>
              {resultadoSync.o_que_nao_foi_feito.length === 0 ? (
                <p className="text-xs text-gray-500 font-mono">Nenhum item pendente.</p>
              ) : (
                <ul className="space-y-2.5 text-xs text-gray-300 font-mono list-disc list-inside">
                  {resultadoSync.o_que_nao_foi_feito.map((item, idx) => (
                    <li key={idx} className="leading-relaxed">{item}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Erros (Vermelho) */}
            <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-xl space-y-4">
              <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 uppercase tracking-wider font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Erros Encontrados
              </h4>
              {resultadoSync.erros_identificados.length === 0 ? (
                <p className="text-xs text-green-400 font-mono">Nenhum erro relatado no momento! 🎉</p>
              ) : (
                <ul className="space-y-2.5 text-xs text-gray-300 font-mono list-disc list-inside">
                  {resultadoSync.erros_identificados.map((item, idx) => (
                    <li key={idx} className="leading-relaxed text-red-300">{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2 uppercase tracking-wider font-mono">
              🚀 Próximos Passos recomendados pelo Antigravity
            </h4>
            {resultadoSync.proximos_passos.length === 0 ? (
              <p className="text-xs text-gray-500 font-mono">Nenhum próximo passo listado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {resultadoSync.proximos_passos.map((item, idx) => (
                  <div key={idx} className="bg-[#0d0d0d] p-3 rounded-lg border border-[#2a2a2a] text-xs text-gray-300 font-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Painel de Saúde do Projeto */}
      {saude && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl relative overflow-hidden">
          <div className="border-b border-[#2a2a2a] pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-400" /> Painel de Saúde do Projeto
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-mono">Indicadores calculados dinamicamente para auditoria de riscos</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
              saude.nivel_risco === 'ALTO' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
              saude.nivel_risco === 'MÉDIO' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
              'bg-green-500/10 text-green-400 border-green-500/20'
            }`}>
              Risco: {saude.nivel_risco}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs text-gray-300">
            <div className="bg-[#0d0d0d] p-5 rounded-xl border border-[#2a2a2a] space-y-2">
              <div className="text-gray-500">Confiança da IA</div>
              <div className="text-3xl font-bold text-white flex items-baseline gap-1.5">
                {saude.score_confianca}
                <span className="text-xs text-gray-500 font-normal">/100</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold inline-block ${
                saude.categoria_confianca === 'Confiável' ? 'bg-green-500/10 text-green-400' :
                saude.categoria_confianca === 'Instável' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {saude.categoria_confianca}
              </span>
            </div>

            <div className="bg-[#0d0d0d] p-5 rounded-xl border border-[#2a2a2a] space-y-2">
              <div className="text-gray-500">Erros Ativos</div>
              <div className="text-3xl font-bold text-red-500">{saude.erros_ativos}</div>
              <div className="text-[10px] text-gray-500">erros sem solução no log</div>
            </div>

            <div className="bg-[#0d0d0d] p-5 rounded-xl border border-[#2a2a2a] space-y-2">
              <div className="text-gray-500">Última Sincronização</div>
              <div className="text-lg font-bold text-white pt-1">{saude.data_ultima_sessao}</div>
              <div className="text-[10px] text-gray-500 font-mono">via Antigravity</div>
            </div>

            <div className="bg-[#0d0d0d] p-5 rounded-xl border border-[#2a2a2a] space-y-2">
              <div className="text-gray-500">Próxima Tarefa (task.md)</div>
              <div className="text-xs font-bold text-[#e8ff5a] line-clamp-2 pt-1 leading-relaxed">{saude.proxima_tarefa}</div>
            </div>
          </div>

          {saude.alertas_ativos.length > 0 && (
            <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Alertas Automáticos de Risco
              </h4>
              <ul className="space-y-2 text-xs text-red-300 font-mono list-disc list-inside">
                {saude.alertas_ativos.map((alerta: string, idx: number) => (
                  <li key={idx}>{alerta}</li>
                ))}
              </ul>
            </div>
          )}
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

      {/* Validador de Entrega */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl">
        <div className="border-b border-[#2a2a2a] pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" /> Validador de Entrega (IA Auditor)
            </h3>
            <p className="text-xs text-gray-400 mt-1 font-mono">Compare o escopo solicitado pelo cliente com o que a IA de fato implementou</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block font-bold">
              📥 O que foi pedido (Escopo / Requisitos)
            </label>
            <textarea
              value={escopoPedido}
              onChange={(e) => setEscopoPedido(e.target.value)}
              placeholder="Descreva as especificações fornecidas ao agente. Ex: Adicionar botão de download com padrão de nomenclatura DDMMAA_HHMM nas páginas..."
              rows={6}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors font-mono resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block font-bold">
              🛠️ O que a IA disse que fez (Alegações / Logs)
            </label>
            <textarea
              value={IAEntregue}
              onChange={(e) => setIAEntregue(e.target.value)}
              placeholder="Cole as alegações da IA sobre as alterações feitas. Ex: Modifiquei o arquivo projetos.ts e implementei a nomenclatura de download..."
              rows={6}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-colors font-mono resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleValidarEntrega}
            disabled={validandoEntrega || !escopoPedido.trim() || !IAEntregue.trim()}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 text-xs uppercase tracking-wider cursor-pointer font-mono"
          >
            {validandoEntrega ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analisando Escopo...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Validar com IA</span>
              </>
            )}
          </button>
        </div>

        {/* Exibição do Resultado da Auditoria */}
        {resultadoAuditoria && (
          <div className="mt-6 p-6 bg-[#0d0d0d] rounded-xl border border-[#2a2a2a] space-y-4 animate-fade-in">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-[#2a2a2a]/60 pb-2">
              📊 Relatório de Auditoria de Requisitos
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3 bg-[#111111] p-4 rounded-lg border border-[#2a2a2a]">
                <h5 className="text-xs font-bold text-green-400 font-mono uppercase tracking-wider">✅ Feito Corretamente</h5>
                <ul className="text-xs text-gray-300 font-mono space-y-1.5 list-disc list-inside">
                  {resultadoAuditoria.feito_corretamente && resultadoAuditoria.feito_corretamente.length > 0 ? (
                    resultadoAuditoria.feito_corretamente.map((item: string, idx: number) => <li key={idx}>{item}</li>)
                  ) : (
                    <span className="text-gray-500 italic">Nenhum verificado.</span>
                  )}
                </ul>
              </div>

              <div className="space-y-3 bg-[#111111] p-4 rounded-lg border border-[#2a2a2a]">
                <h5 className="text-xs font-bold text-yellow-400 font-mono uppercase tracking-wider">⚠️ Diferente do Pedido</h5>
                <ul className="text-xs text-gray-300 font-mono space-y-1.5 list-disc list-inside">
                  {resultadoAuditoria.feito_diferente && resultadoAuditoria.feito_diferente.length > 0 ? (
                    resultadoAuditoria.feito_diferente.map((item: string, idx: number) => <li key={idx}>{item}</li>)
                  ) : (
                    <span className="text-gray-500 italic">Nenhum verificado.</span>
                  )}
                </ul>
              </div>

              <div className="space-y-3 bg-[#111111] p-4 rounded-lg border border-[#2a2a2a]">
                <h5 className="text-xs font-bold text-red-400 font-mono uppercase tracking-wider">❌ Não Foi Feito</h5>
                <ul className="text-xs text-gray-300 font-mono space-y-1.5 list-disc list-inside">
                  {resultadoAuditoria.nao_feito && resultadoAuditoria.nao_feito.length > 0 ? (
                    resultadoAuditoria.nao_feito.map((item: string, idx: number) => <li key={idx}>{item}</li>)
                  ) : (
                    <span className="text-gray-500 italic">Nenhum verificado.</span>
                  )}
                </ul>
              </div>

              <div className="space-y-3 bg-[#111111] p-4 rounded-lg border border-[#2a2a2a]">
                <h5 className="text-xs font-bold text-purple-400 font-mono uppercase tracking-wider">🚨 Feito sem Solicitação (Extra/Mocks)</h5>
                <ul className="text-xs text-gray-300 font-mono space-y-1.5 list-disc list-inside">
                  {resultadoAuditoria.feito_extra && resultadoAuditoria.feito_extra.length > 0 ? (
                    resultadoAuditoria.feito_extra.map((item: string, idx: number) => <li key={idx}>{item}</li>)
                  ) : (
                    <span className="text-gray-500 italic">Nenhum verificado.</span>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
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
