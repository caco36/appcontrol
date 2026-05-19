import React, { useState } from 'react';
import { useProjetosStore } from '../store/projetos';
import { 
  Eye, Sparkles, Copy, CheckCircle2, AlertCircle, 
  PlayCircle, CheckSquare2, AlertOctagon, Terminal 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Vistoria: React.FC = () => {
  const { projetoAtivo } = useProjetosStore();
  const [vistoriaGerada, setVistoriaGerada] = useState<string>('');
  const [tipoAtivo, setTipoAtivo] = useState<'PRE' | 'POS' | 'EMERGENCIA' | null>(null);
  const [copiado, setCopiado] = useState(false);

  const handleGerarVistoria = (tipo: 'PRE' | 'POS' | 'EMERGENCIA') => {
    setTipoAtivo(tipo);
    let prompt = '';

    if (tipo === 'PRE') {
      prompt = `[AppControl v1.0 — Vistoria PRÉ-Sessão Inicial]
PROJETO ATIVO: ${projetoAtivo?.nome || 'Nenhum selecionado'}
TIPO: ${projetoAtivo?.tipo || 'N/A'}
STACK FRONTEND: ${projetoAtivo?.stack_fe || 'Não especificada'}
STACK BACKEND: ${projetoAtivo?.stack_be || 'Não especificada'}

================================================================================
OBJETIVO DA VISTORIA PRÉ
================================================================================
Antes de iniciar qualquer nova funcionalidade ou refatoração, a IA deve realizar um diagnóstico completo do estado atual do repositório para garantir que o contexto está perfeitamente alinhado com o Guard Prompt.

================================================================================
CHECKLIST DE VERIFICAÇÃO PRÉVIA (INSTRUÇÃO PARA A IA)
================================================================================
1. Liste todos os arquivos que você planeja inspecionar ou modificar nesta sessão.
2. Confirme que você leu e compreendeu as Regras Especiais e os Arquivos Críticos Protegidos do projeto.
3. Identifique quaisquer dependências ou pacotes que possam estar faltando antes de propro novos códigos.
4. Aguarde o 'OK' explícito do desenvolvedor antes de executar qualquer alteração.`;
    } else if (tipo === 'POS') {
      prompt = `[AppControl v1.0 — Vistoria PÓS-Sessão de Fechamento]
PROJETO ATIVO: ${projetoAtivo?.nome || 'Nenhum selecionado'}
TIPO: ${projetoAtivo?.tipo || 'N/A'}

================================================================================
OBJETIVO DA VISTORIA PÓS
================================================================================
Ao finalizar as tarefas da sessão, a IA deve realizar uma auditoria de conformidade para garantir que o código gerado segue os padrões de qualidade e não quebrou nenhuma regra arquitetural.

================================================================================
CHECKLIST DE VERIFICAÇÃO PÓS (INSTRUÇÃO PARA A IA)
================================================================================
1. Verifique se todos os critérios de aceitação do Checklist de Tarefa foram cumpridos.
2. Certifique-se de que nenhum Arquivo Crítico Protegido foi modificado indevidamente.
3. Confirme que não foram deixados códigos mortos, comentários de TODO desnecessários ou mocks temporários.
4. Apresente um resumo claro de tudo o que foi feito para ser salvo no Histórico de Sessões do AppControl.`;
    } else {
      prompt = `[AppControl v1.0 — Vistoria de EMERGÊNCIA / Resgate de Contexto]
PROJETO ATIVO: ${projetoAtivo?.nome || 'Nenhum selecionado'}
TIPO: ${projetoAtivo?.tipo || 'N/A'}

================================================================================
ALERTA CRÍTICO DE DESALINHAMENTO (INSTRUÇÃO PARA A IA)
================================================================================
Pare imediatamente todas as ações em andamento. Foi detectada uma possível perda de contexto, alucinação de código ou violação das regras arquiteturais do projeto.

================================================================================
PROTOCOLO DE RESGATE IMEDIATO
================================================================================
1. Descarte quaisquer suposições ou alterações não validadas feitas nas últimas mensagens.
2. Releia imediatamente o Guard Prompt e a Lei Primordial do projeto.
3. Liste os arquivos que foram tocados recentemente e identifique onde ocorreu o desvio da arquitetura.
4. Proponha um plano de reversão ou correção imediata para restaurar a estabilidade do sistema antes de prosseguir com novas tarefas.`;
    }

    setVistoriaGerada(prompt);
  };

  const handleCopiar = () => {
    if (!vistoriaGerada) return;
    navigator.clipboard.writeText(vistoriaGerada);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  if (!projetoAtivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 animate-fade-in font-sans">
        <AlertCircle className="w-12 h-12 text-yellow-500" />
        <h3 className="text-xl font-bold text-white">Nenhum Projeto Ativo Selecionado</h3>
        <p className="text-sm text-gray-400 font-mono max-w-md">
          Para gerar os prompts de Vistoria (PRÉ, PÓS e Emergência), selecione ou crie um projeto no Dashboard ou na Sidebar.
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
          <Eye className="w-48 h-48 text-[#e8ff5a]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-[#2a2a2a]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 text-[#e8ff5a] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Inspeção e Auditoria
              </span>
              <span className="text-xs text-gray-500 font-mono">Projeto: {projetoAtivo.nome}</span>
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Módulo Vistoria de IA
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Gere prompts de verificação de contexto para início de sessão (PRÉ), auditoria final (PÓS) ou resgate de alucinações (Emergência).
            </p>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-4">
            <Eye className="w-8 h-8 text-[#e8ff5a]" />
            <div>
              <div className="text-xs text-gray-400 font-mono">Status da Auditoria</div>
              <div className="text-sm font-bold text-green-400 font-mono">Pronto para Verificação</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Botões de Acionamento e Exibição da Vistoria */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Painel de Botões de Vistoria */}
        <div className="lg:col-span-5 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-[#2a2a2a] pb-4 font-mono">
            <Terminal className="w-5 h-5 text-[#e8ff5a]" /> Selecionar Modo de Vistoria
          </h3>

          <div className="space-y-4">
            {/* Vistoria PRÉ */}
            <button
              type="button"
              onClick={() => handleGerarVistoria('PRE')}
              className={`w-full p-6 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer group ${
                tipoAtivo === 'PRE'
                  ? 'bg-blue-500/10 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                  : 'bg-[#0d0d0d] border-[#2a2a2a] text-gray-300 hover:border-blue-500/50 hover:bg-[#151515]'
              }`}
            >
              <PlayCircle className={`w-8 h-8 shrink-0 mt-0.5 ${tipoAtivo === 'PRE' ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400 transition-colors'}`} />
              <div className="space-y-1">
                <div className="text-base font-bold text-white flex items-center gap-2 font-mono">
                  <span>1. VISTORIA PRÉ</span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full uppercase">Início de Sessão</span>
                </div>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  Gera o prompt de diagnóstico inicial para garantir que a IA compreenda o Guard Prompt e inspecione o repositório antes de codificar.
                </p>
              </div>
            </button>

            {/* Vistoria PÓS */}
            <button
              type="button"
              onClick={() => handleGerarVistoria('POS')}
              className={`w-full p-6 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer group ${
                tipoAtivo === 'POS'
                  ? 'bg-green-500/10 border-green-500 text-white shadow-lg shadow-green-500/10'
                  : 'bg-[#0d0d0d] border-[#2a2a2a] text-gray-300 hover:border-green-500/50 hover:bg-[#151515]'
              }`}
            >
              <CheckSquare2 className={`w-8 h-8 shrink-0 mt-0.5 ${tipoAtivo === 'POS' ? 'text-green-400' : 'text-gray-500 group-hover:text-green-400 transition-colors'}`} />
              <div className="space-y-1">
                <div className="text-base font-bold text-white flex items-center gap-2 font-mono">
                  <span>2. VISTORIA PÓS</span>
                  <span className="text-[10px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full uppercase">Fim de Sessão</span>
                </div>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  Gera o prompt de auditoria de conformidade para validar se a IA cumpriu os critérios da tarefa e não deixou código sujo ou mocks.
                </p>
              </div>
            </button>

            {/* Vistoria de EMERGÊNCIA */}
            <button
              type="button"
              onClick={() => handleGerarVistoria('EMERGENCIA')}
              className={`w-full p-6 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer group ${
                tipoAtivo === 'EMERGENCIA'
                  ? 'bg-red-500/10 border-red-500 text-white shadow-lg shadow-red-500/10'
                  : 'bg-[#0d0d0d] border-[#2a2a2a] text-gray-300 hover:border-red-500/50 hover:bg-[#151515]'
              }`}
            >
              <AlertOctagon className={`w-8 h-8 shrink-0 mt-0.5 ${tipoAtivo === 'EMERGENCIA' ? 'text-red-400' : 'text-gray-500 group-hover:text-red-400 transition-colors'}`} />
              <div className="space-y-1">
                <div className="text-base font-bold text-white flex items-center gap-2 font-mono">
                  <span>3. VISTORIA DE EMERGÊNCIA</span>
                  <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full uppercase animate-pulse">Alerta Crítico</span>
                </div>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  Gera o protocolo imediato de resgate de contexto para frear alucinações da IA e forçar a releitura da Lei Primordial e regras.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Área de Exibição do Prompt Gerado */}
        <div className="lg:col-span-7 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl flex flex-col h-full min-h-[500px]">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <Terminal className="w-5 h-5 text-[#e8ff5a]" /> Prompt de Vistoria Gerado
            </h3>

            <button
              type="button"
              onClick={handleCopiar}
              disabled={!vistoriaGerada}
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
            {vistoriaGerada ? (
              <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-y-auto max-h-[550px] select-all leading-relaxed w-full">
                {vistoriaGerada}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono text-xs select-none space-y-3">
                <Eye className="w-12 h-12 text-[#2a2a2a] animate-pulse" />
                <p>Clique em um dos botões ao lado (PRÉ, PÓS ou Emergência) para compilar o prompt de verificação e auditoria para a IA.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
