import React, { useState, useEffect } from 'react';
import { useProjetosStore } from '../store/projetos';
import { 
  ShieldCheck, Sparkles, Copy, CheckCircle2, Save, Loader2, AlertCircle, 
  FileCode, Server, Cpu, ShieldAlert, Terminal, Plus, Trash2 
} from 'lucide-react';

export const GuardPrompt: React.FC = () => {
  const { projetoAtivo, atualizarProjeto, erro } = useProjetosStore();

  const [stackFe, setStackFe] = useState('');
  const [stackBe, setStackBe] = useState('');
  const [llmBase, setLlmBase] = useState('Gemini (Flash)');
  const [arquivosCriticos, setArquivosCriticos] = useState<string[]>([]);
  const [novoArquivo, setNovoArquivo] = useState('');
  const [regrasEspeciais, setRegrasEspeciais] = useState('');

  const [guardPromptGerado, setGuardPromptGerado] = useState<string>('');
  const [copiado, setCopiado] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [sucessoSalvar, setSucessoSalvar] = useState<string | null>(null);

  useEffect(() => {
    if (projetoAtivo) {
      setStackFe(projetoAtivo.stack_fe || '');
      setStackBe(projetoAtivo.stack_be || '');
      setLlmBase(projetoAtivo.llm_base || 'Gemini (Flash)');
      setArquivosCriticos(projetoAtivo.arquivos_criticos || []);
      setRegrasEspeciais(projetoAtivo.regras_especiais || '');
    }
  }, [projetoAtivo]);

  const handleAddArquivo = () => {
    if (novoArquivo.trim() && !arquivosCriticos.includes(novoArquivo.trim())) {
      setArquivosCriticos([...arquivosCriticos, novoArquivo.trim()]);
      setNovoArquivo('');
    }
  };

  const handleRemoveArquivo = (index: number) => {
    setArquivosCriticos(arquivosCriticos.filter((_, i) => i !== index));
  };

  const handleGerarPrompt = () => {
    const prompt = `[AppControl v1.0 — Guard Prompt Ativo]
PROJETO: ${projetoAtivo?.nome || 'Nenhum selecionado'}
TIPO: ${projetoAtivo?.tipo || 'N/A'}
STACK FRONTEND: ${stackFe || 'Não especificada'}
STACK BACKEND: ${stackBe || 'Não especificada'}
LLM PREFERIDO: ${llmBase}

================================================================================
LEI PRIMORDIAL DO PROJETO & REGRAS DE ARQUITETURA
================================================================================
${regrasEspeciais || '1. Mantenha o código limpo, evite mocks temporários e respeite a arquitetura existente.'}

================================================================================
ARQUIVOS CRÍTICOS PROTEGIDOS (NÃO MODIFIQUE SEM AUTORIZAÇÃO PRÉVIA)
================================================================================
${arquivosCriticos.length > 0 ? arquivosCriticos.map(arq => `- ${arq}`).join('\n') : '- Nenhum arquivo crítico especificado.'}

INSTRUÇÃO PARA A IA:
Antes de propor qualquer modificação, certifique-se de que sua solução respeita estritamente as regras e arquivos protegidos listados acima.`;

    setGuardPromptGerado(prompt);
  };

  const handleCopiar = () => {
    if (!guardPromptGerado) return;
    navigator.clipboard.writeText(guardPromptGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleSalvarConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projetoAtivo) return;

    setSalvando(true);
    setSucessoSalvar(null);
    try {
      await atualizarProjeto(projetoAtivo.id, {
        stack_fe: stackFe,
        stack_be: stackBe,
        llm_base: llmBase,
        arquivos_criticos: arquivosCriticos,
        regras_especiais: regrasEspeciais
      });
      setSucessoSalvar('Configurações do Guard Prompt salvas com sucesso no banco de dados!');
      setTimeout(() => setSucessoSalvar(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

  if (!projetoAtivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 animate-fade-in font-sans">
        <AlertCircle className="w-12 h-12 text-yellow-500" />
        <h3 className="text-xl font-bold text-white">Nenhum Projeto Ativo Selecionado</h3>
        <p className="text-sm text-gray-400 font-mono max-w-md">
          Para configurar e gerar o Guard Prompt, selecione ou crie um projeto no Dashboard ou na Sidebar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">
      {/* Cabeçalho */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <ShieldCheck className="w-48 h-48 text-[#e8ff5a]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-[#2a2a2a]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 text-[#e8ff5a] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Proteção Ativa
              </span>
              <span className="text-xs text-gray-500 font-mono">Projeto: {projetoAtivo.nome}</span>
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Módulo Guard Prompt
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Configure as regras de proteção, stacks e arquivos intocáveis para blindar o contexto da IA.
            </p>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-[#e8ff5a]" />
            <div>
              <div className="text-xs text-gray-400 font-mono">Status da Blindagem</div>
              <div className="text-sm font-bold text-green-400 font-mono">Ativa e Monitorando</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] space-y-1">
            <span className="text-gray-500 block">Stack FE Atual</span>
            <span className="text-white font-bold truncate block">{projetoAtivo.stack_fe || 'Não definida'}</span>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] space-y-1">
            <span className="text-gray-500 block">Stack BE Atual</span>
            <span className="text-white font-bold truncate block">{projetoAtivo.stack_be || 'Não definida'}</span>
          </div>
          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] space-y-1">
            <span className="text-gray-500 block">IA Preferida</span>
            <span className="text-[#e8ff5a] font-bold truncate block">{projetoAtivo.llm_base || 'Gemini (Flash)'}</span>
          </div>
        </div>
      </div>

      {erro && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{erro}</span>
        </div>
      )}

      {sucessoSalvar && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-sm font-semibold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <span>{sucessoSalvar}</span>
        </div>
      )}

      {/* Grid Formulário e Exibição do Prompt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulário de Edição */}
        <form onSubmit={handleSalvarConfig} className="lg:col-span-6 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-[#2a2a2a] pb-4">
            <Terminal className="w-5 h-5 text-[#e8ff5a]" /> Configurações de Proteção
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" /> Stack Frontend
              </label>
              <input
                type="text"
                value={stackFe}
                onChange={(e) => setStackFe(e.target.value)}
                placeholder="Ex: React 18, Tailwind v4"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-green-400" /> Stack Backend
              </label>
              <input
                type="text"
                value={stackBe}
                onChange={(e) => setStackBe(e.target.value)}
                placeholder="Ex: FastAPI, Supabase"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" /> LLM Preferido
            </label>
            <select
              value={llmBase}
              onChange={(e) => setLlmBase(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans text-sm cursor-pointer"
            >
              <option value="Gemini (Flash)">Gemini 2.5 Flash</option>
              <option value="Gemini (Pro)">Gemini 1.5 Pro</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              <option value="GPT-4o">GPT-4o</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-yellow-400" /> Arquivos Críticos Protegidos
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={novoArquivo}
                onChange={(e) => setNovoArquivo(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddArquivo())}
                placeholder="Ex: backend/app/main.py"
                className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-mono text-sm"
              />
              <button
                type="button"
                onClick={handleAddArquivo}
                className="px-4 py-3 bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] hover:text-[#e8ff5a] rounded-xl font-bold transition-all flex items-center gap-1 text-xs uppercase tracking-wider shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {arquivosCriticos.length > 0 ? (
                arquivosCriticos.map((arq, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0d0d0d] border border-[#2a2a2a] text-yellow-300 rounded-lg font-mono text-xs group">
                    <span>{arq}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveArquivo(idx)}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-gray-500 font-mono text-xs italic">Nenhum arquivo crítico adicionado ainda.</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e8ff5a]" /> Regras Especiais / Lei Primordial
            </label>
            <textarea
              value={regrasEspeciais}
              onChange={(e) => setRegrasEspeciais(e.target.value)}
              placeholder="Descreva as regras arquiteturais estritas que a IA nunca deve quebrar..."
              rows={5}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-mono text-sm resize-y"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a] gap-4">
            <button
              type="submit"
              disabled={salvando}
              className="flex-1 py-3 bg-[#2a2a2a] text-white font-bold rounded-xl hover:bg-[#3a3a3a] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Salvar Configuração no Banco</span>
            </button>

            <button
              type="button"
              onClick={handleGerarPrompt}
              className="flex-1 py-3 bg-[#e8ff5a] text-[#0d0d0d] font-bold rounded-xl hover:bg-[#d4eb45] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-[#e8ff5a]/10 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Guard Prompt</span>
            </button>
          </div>
        </form>

        {/* Área de Exibição do Prompt Gerado */}
        <div className="lg:col-span-6 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <Terminal className="w-5 h-5 text-[#e8ff5a]" /> Prompt Gerado
            </h3>

            <button
              type="button"
              onClick={handleCopiar}
              disabled={!guardPromptGerado}
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

          <div className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-6 relative group min-h-[350px]">
            {guardPromptGerado ? (
              <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-y-auto max-h-[500px] select-all leading-relaxed">
                {guardPromptGerado}
              </pre>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono text-xs select-none">
                <ShieldCheck className="w-12 h-12 text-[#2a2a2a] mb-3 animate-pulse" />
                <p>Clique em "Gerar Guard Prompt" no formulário ao lado para compilar as regras e blindar o contexto da IA.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
