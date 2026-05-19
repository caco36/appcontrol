import React, { useState } from 'react';
import { useProjetosStore } from '../store/projetos';
import { X, Plus, Loader2, Sparkles, AlertCircle, FileCode, Server, Cpu, ShieldAlert } from 'lucide-react';

interface NovoProjetoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NovoProjetoModal: React.FC<NovoProjetoModalProps> = ({ isOpen, onClose }) => {
  const { criar, loading } = useProjetosStore();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [stackFe, setStackFe] = useState('');
  const [stackBe, setStackBe] = useState('');
  const [llmBase, setLlmBase] = useState('Gemini (Flash)');
  const [arquivosCriticos, setArquivosCriticos] = useState('');
  const [regrasEspeciais, setRegrasEspeciais] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!nome.trim() || !tipo.trim()) {
      setErro('Nome e Tipo do projeto são obrigatórios.');
      return;
    }

    const arquivosLista = arquivosCriticos
      .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0);

    try {
      await criar({
        nome,
        tipo,
        stack_fe: stackFe || undefined,
        stack_be: stackBe || undefined,
        llm_base: llmBase,
        arquivos_criticos: arquivosLista,
        regras_especiais: regrasEspeciais || undefined,
      });
      
      // Limpa os campos e fecha
      setNome('');
      setTipo('');
      setStackFe('');
      setStackBe('');
      setLlmBase('Gemini (Flash)');
      setArquivosCriticos('');
      setRegrasEspeciais('');
      onClose();
    } catch (err: any) {
      setErro(err.response?.data?.detail || 'Erro ao criar projeto.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl w-full max-w-2xl p-6 md:p-8 relative shadow-2xl my-8">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-[#2a2a2a]"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#e8ff5a]/10 rounded-xl border border-[#e8ff5a]/20">
            <Sparkles className="w-6 h-6 text-[#e8ff5a]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Criar Novo Projeto</h2>
            <p className="text-sm text-gray-400 mt-1 font-mono">Inicialize o controle de contexto e roadmap de IA</p>
          </div>
        </div>

        {erro && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{erro}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Nome do Projeto <span className="text-[#e8ff5a]">*</span>
              </label>
              <input 
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Editor Alfa v1.0"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Tipo / Domínio <span className="text-[#e8ff5a]">*</span>
              </label>
              <input 
                type="text"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Ex: Plataforma Acadêmica SaaS"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" /> Stack Frontend
              </label>
              <input 
                type="text"
                value={stackFe}
                onChange={(e) => setStackFe(e.target.value)}
                placeholder="Ex: React + Vite + Tailwind"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <Server className="w-4 h-4 text-green-400" /> Stack Backend
              </label>
              <input 
                type="text"
                value={stackBe}
                onChange={(e) => setStackBe(e.target.value)}
                placeholder="Ex: Python + FastAPI + Supabase"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" /> LLM Preferido (IA Base)
            </label>
            <select
              value={llmBase}
              onChange={(e) => setLlmBase(e.target.value)}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans cursor-pointer"
            >
              <option value="Gemini (Flash)">Gemini (Flash) — Ativo</option>
              <option value="Claude (Sonnet)">Claude (Sonnet) — Preparado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-yellow-400" /> Arquivos Críticos (Separados por vírgula)
            </label>
            <input 
              type="text"
              value={arquivosCriticos}
              onChange={(e) => setArquivosCriticos(e.target.value)}
              placeholder="Ex: auth_service.py, App.tsx, schema.sql"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1 font-mono">Arquivos que a IA é estritamente proibida de deletar ou refatorar sem autorização.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Regras Especiais / Prompt Guard
            </label>
            <textarea
              value={regrasEspeciais}
              onChange={(e) => setRegrasEspeciais(e.target.value)}
              placeholder="Ex: Nunca usar mocks permanentes. Sempre usar tipagem estrita no TypeScript."
              rows={4}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-mono text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#2a2a2a]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-[#2a2a2a] text-gray-300 hover:bg-[#2a2a2a] transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#e8ff5a] text-[#0d0d0d] rounded-xl font-bold hover:bg-[#d4eb45] transition-all flex items-center gap-2 shadow-lg shadow-[#e8ff5a]/10 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Criando Projeto...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" /> Confirmar e Criar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
