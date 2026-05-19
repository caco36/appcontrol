import React from 'react';
import { useExtratorStore } from '../store/extrator';
import { useProjetosStore } from '../store/projetos';
import { 
  Cpu, Sparkles, AlertCircle, CheckCircle2, Loader2, Save, AlertOctagon, 
  FileText, FileCheck, FileX, CheckSquare, XSquare, ShieldAlert, Trash2, ArrowRight, Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Extrator: React.FC = () => {
  const { projetoAtivo } = useProjetosStore();
  const { 
    respostaIa, contexto, resultado, loading, erro, salvandoSessao, salvandoErros, 
    sessaoSalvaId, errosSalvosStatus, setRespostaIa, setContexto, analisar, salvarSessao, registrarErros, limpar 
  } = useExtratorStore();

  const handleAnalisar = (e: React.FormEvent) => {
    e.preventDefault();
    analisar(projetoAtivo?.id);
  };

  const handleSalvarSessao = async () => {
    if (!projetoAtivo) {
      alert('Selecione um Projeto Ativo na Sidebar ou Dashboard antes de salvar no histórico.');
      return;
    }
    await salvarSessao(projetoAtivo.id);
  };

  const handleRegistrarErros = async () => {
    if (!projetoAtivo) {
      alert('Selecione um Projeto Ativo na Sidebar ou Dashboard antes de registrar erros.');
      return;
    }
    await registrarErros(projetoAtivo.id);
  };

  const renderSectionCard = (titulo: string, itens: string[], icon: React.ReactNode, corIcone: string, corBorda: string) => {
    if (!itens || itens.length === 0) return null;
    return (
      <div className={`bg-[#0d0d0d] border ${corBorda} p-6 rounded-xl space-y-4 shadow-lg`}>
        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2.5">
          <span className={corIcone}>{icon}</span> {titulo} ({itens.length})
        </h4>
        <ul className="space-y-2 font-sans text-sm text-gray-300 divide-y divide-[#2a2a2a]/40">
          {itens.map((item, idx) => (
            <li key={idx} className="pt-2 first:pt-0 flex items-start gap-2">
              <span className="text-[#e8ff5a] font-bold select-none">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-16">
      {/* Cabeçalho do Extrator */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Cpu className="w-48 h-48 text-[#e8ff5a]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-[#2a2a2a]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 text-[#e8ff5a] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Core de Análise
              </span>
              <span className="text-xs text-gray-500 font-mono">Motor: Gemini 2.5 Flash</span>
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Módulo Extrator IA
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Cole a resposta bruta da IA para decodificar modificações, arquivos tocados, riscos e pendências.
            </p>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-[#e8ff5a] animate-pulse" />
            <div>
              <div className="text-xs text-gray-400 font-mono">Projeto de Destino</div>
              <div className="text-sm font-bold text-white font-mono truncate max-w-[200px]">
                {projetoAtivo ? projetoAtivo.nome : <span className="text-yellow-400 italic">Nenhum selecionado</span>}
              </div>
            </div>
          </div>
        </div>

        {!projetoAtivo && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-center justify-between gap-4 text-yellow-300 text-xs font-mono">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Você não selecionou um projeto ativo. A análise funcionará normalmente, mas para salvar no histórico você precisará selecionar um projeto.</span>
            </div>
            <Link to="/" className="underline font-bold text-white hover:text-[#e8ff5a] shrink-0">Selecionar Projeto</Link>
          </div>
        )}
      </div>

      {erro && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{erro}</span>
        </div>
      )}

      {/* Formulário de Entrada */}
      <form onSubmit={handleAnalisar} className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-300 font-mono flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#e8ff5a]" /> Resposta Bruta da IA <span className="text-[#e8ff5a]">*</span>
          </label>
          <textarea
            value={respostaIa}
            onChange={(e) => setRespostaIa(e.target.value)}
            placeholder="Cole aqui todo o texto de resposta gerado pelo LLM (código, explicações, listas, etc.)..."
            rows={8}
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-mono text-sm resize-y"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-300 font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Contexto Opcional / Instrução Original
          </label>
          <input
            type="text"
            value={contexto}
            onChange={(e) => setContexto(e.target.value)}
            placeholder="Ex: Pedi para refatorar o auth_service.py e criar o endpoint de logout."
            className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#2a2a2a]">
          {(respostaIa || contexto || resultado) && (
            <button
              type="button"
              onClick={limpar}
              className="px-6 py-3 rounded-xl border border-[#2a2a2a] text-gray-400 hover:bg-[#2a2a2a] transition-colors font-semibold text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Limpar
            </button>
          )}

          <button
            type="submit"
            disabled={loading || !respostaIa.trim()}
            className="px-8 py-3 bg-[#e8ff5a] text-[#0d0d0d] rounded-xl font-bold hover:bg-[#d4eb45] transition-all flex items-center gap-2 shadow-lg shadow-[#e8ff5a]/10 disabled:opacity-50 text-xs uppercase tracking-wider cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Analisando com Gemini IA...
              </>
            ) : (
              <>
                <Cpu className="w-5 h-5" /> Analisar com IA
              </>
            )}
          </button>
        </div>
      </form>

      {/* Renderização dos Resultados em Cards Organizados por Seção */}
      {resultado && (
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-8 shadow-xl animate-fade-in">
          {/* Barra de Status e Ações Rápidas */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#2a2a2a]">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                  resultado.status === 'sucesso' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  resultado.status === 'parcial' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  Status: {resultado.status}
                </span>
                <h3 className="text-xl font-bold text-white">Análise Concluída</h3>
              </div>
              <p className="text-sm text-gray-300 font-sans mt-2 bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a]">
                {resultado.resumo}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <button
                onClick={handleSalvarSessao}
                disabled={salvandoSessao || !!sessaoSalvaId}
                className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                  sessaoSalvaId 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                    : 'bg-[#e8ff5a] text-[#0d0d0d] hover:bg-[#d4eb45] shadow-[#e8ff5a]/10 disabled:opacity-50'
                }`}
              >
                {salvandoSessao ? <Loader2 className="w-4 h-4 animate-spin" /> : sessaoSalvaId ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{sessaoSalvaId ? 'Sessão Salva!' : 'Salvar no Histórico'}</span>
              </button>

              {resultado.erros_identificados && resultado.erros_identificados.length > 0 && (
                <button
                  onClick={handleRegistrarErros}
                  disabled={salvandoErros || !!errosSalvosStatus}
                  className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                    errosSalvosStatus 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 disabled:opacity-50'
                  }`}
                >
                  {salvandoErros ? <Loader2 className="w-4 h-4 animate-spin" /> : errosSalvosStatus ? <CheckCircle2 className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
                  <span>{errosSalvosStatus ? 'Erros Registrados!' : 'Registrar Erros Encontrados'}</span>
                </button>
              )}
            </div>
          </div>

          {errosSalvosStatus && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-sm font-semibold animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
              <span>{errosSalvosStatus}</span>
            </div>
          )}

          {/* Grid de Cards de Seção */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderSectionCard("Arquivos Tocados", resultado.arquivos_tocados, <FileCheck className="w-4 h-4" />, "text-green-400", "border-green-500/20")}
            {renderSectionCard("Arquivos Não Tocados", resultado.arquivos_nao_tocados, <FileX className="w-4 h-4" />, "text-gray-400", "border-[#2a2a2a]")}
            {renderSectionCard("O Que Foi Feito", resultado.o_que_foi_feito, <CheckSquare className="w-4 h-4" />, "text-blue-400", "border-blue-500/20")}
            {renderSectionCard("O Que Não Foi Feito", resultado.o_que_nao_foi_feito, <XSquare className="w-4 h-4" />, "text-yellow-400", "border-yellow-500/20")}
            {renderSectionCard("Erros Identificados", resultado.erros_identificados, <AlertOctagon className="w-4 h-4" />, "text-red-400", "border-red-500/20")}
            {renderSectionCard("Riscos e Alertas", resultado.riscos, <ShieldAlert className="w-4 h-4" />, "text-orange-400", "border-orange-500/20")}
            {renderSectionCard("Arquivos Críticos Mencionados", resultado.arquivos_criticos_mencionados, <Sparkles className="w-4 h-4" />, "text-purple-400", "border-purple-500/20")}
            {renderSectionCard("Limpeza / Refatoração", resultado.limpeza_feita, <Trash2 className="w-4 h-4" />, "text-teal-400", "border-teal-500/20")}
            {renderSectionCard("Próximos Passos", resultado.proximos_passos, <ArrowRight className="w-4 h-4" />, "text-[#e8ff5a]", "border-[#e8ff5a]/20")}
            {renderSectionCard("Alertas Gerais", resultado.alertas, <Bell className="w-4 h-4" />, "text-yellow-300", "border-yellow-500/20")}
          </div>
        </div>
      )}
    </div>
  );
};
