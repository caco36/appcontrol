import React, { useState } from 'react';
import { useProjetosStore } from '../store/projetos';
import { projetosService } from '../services/projetos';
import { 
  FileText, Sparkles, Copy, CheckCircle2, AlertCircle, 
  Loader2, RefreshCw, Terminal, Download, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { downloadMarkdown } from '../utils/nomenclatura';

export const Briefing: React.FC = () => {
  const { projetoAtivo } = useProjetosStore();

  const [briefingGerado, setBriefingGerado] = useState<string>('');
  const [gerando, setGerando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleGerarBriefing = async () => {
    if (!projetoAtivo) return;
    setGerando(true);
    setErro(null);
    try {
      const res = await projetosService.gerarBriefing(projetoAtivo.id);
      if (res.status === 'sucesso' && res.briefing) {
        setBriefingGerado(res.briefing);
      } else {
        setErro('Falha ao gerar briefing. Verifique o console.');
      }
    } catch (err: any) {
      setErro(err?.response?.data?.detail || 'Erro ao comunicar com o servidor.');
    } finally {
      setGerando(false);
    }
  };

  const handleCopiar = () => {
    if (!briefingGerado) return;
    navigator.clipboard.writeText(briefingGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  if (!projetoAtivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 animate-fade-in font-sans">
        <AlertCircle className="w-12 h-12 text-yellow-500" />
        <h3 className="text-xl font-bold text-white">Nenhum Projeto Ativo Selecionado</h3>
        <p className="text-sm text-gray-400 font-mono max-w-md">
          Para gerar o Briefing Consolidado, selecione ou crie um projeto no Dashboard.
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
                <Zap className="w-3.5 h-3.5" /> Sincronização Antigravity
              </span>
              <span className="text-xs text-gray-500 font-mono">Projeto: {projetoAtivo.nome}</span>
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Módulo Briefing
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Gere um briefing consolidado do projeto para iniciar uma nova sessão com o Antigravity sem perder contexto.
            </p>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-4">
            <FileText className="w-8 h-8 text-[#e8ff5a]" />
            <div>
              <div className="text-xs text-gray-400 font-mono">Status da Documentação</div>
              <div className="text-sm font-bold text-green-400 font-mono">Pronto para Gerar</div>
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

      {/* Grid: Ação e Resultado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Painel Esquerdo: Instruções e Ação */}
        <div className="lg:col-span-5 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-[#2a2a2a] pb-4 font-mono">
            <Sparkles className="w-5 h-5 text-[#e8ff5a]" /> Geração de Briefing
          </h3>
          
          <div className="space-y-4 text-sm text-gray-400 font-sans leading-relaxed">
            <p>
              O **Briefing Consolidado** utiliza IA para compilar o estado atual do projeto, incluindo:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Progresso e Fases Atuais</li>
              <li>Stack Tecnológica</li>
              <li>Arquivos Críticos</li>
              <li>Regras Especiais / Lei Primordial</li>
              <li>Últimos Erros Registrados</li>
            </ul>
            <p>
              Copie o resultado e envie para o agente Antigravity no início de uma nova conversa.
            </p>
          </div>

          <div className="pt-4 border-t border-[#2a2a2a]">
            <button
              type="button"
              onClick={handleGerarBriefing}
              disabled={gerando}
              className="w-full py-4 bg-[#e8ff5a] text-[#0d0d0d] font-bold rounded-xl hover:bg-[#d4eb45] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-[#e8ff5a]/10 disabled:opacity-50 cursor-pointer"
            >
              {gerando ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
              <span>{gerando ? 'Compilando Dados...' : 'Gerar Briefing Completo'}</span>
            </button>
          </div>
        </div>

        {/* Painel Direito: Exibição do Briefing */}
        <div className="lg:col-span-7 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <Terminal className="w-5 h-5 text-[#e8ff5a]" /> Briefing Gerado
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => projetoAtivo && downloadMarkdown('briefing', projetoAtivo.nome, briefingGerado)}
                disabled={!briefingGerado}
                className="px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all border border-[#e8ff5a]/30 text-[#e8ff5a] bg-[#e8ff5a]/10 hover:bg-[#e8ff5a] hover:text-[#0d0d0d] disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Baixar .md
              </button>
              <button
                type="button"
                onClick={handleCopiar}
                disabled={!briefingGerado}
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
            {briefingGerado ? (
              <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-y-auto max-h-[550px] select-all leading-relaxed w-full">
                {briefingGerado}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono text-xs select-none space-y-3">
                <FileText className="w-12 h-12 text-[#2a2a2a] animate-pulse" />
                <p>Clique em "Gerar Briefing Completo" para compilar o contexto do projeto.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
