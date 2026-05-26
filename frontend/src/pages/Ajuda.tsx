import React from 'react';
import { BookOpen, FolderKanban, ShieldCheck, Cpu, SearchCheck, History, Sparkles, CheckSquare, AlertOctagon, Info } from 'lucide-react';

export const Ajuda: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="border-b border-[#2a2a2a] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Info className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Ajuda Contínua e Manual</h1>
            <p className="text-sm text-gray-400 font-mono mt-1">AppControl v2.0 • Guia Definitivo do Gerente</p>
          </div>
        </div>
        <p className="text-gray-400 mt-4 max-w-3xl leading-relaxed">
          O <strong>AppControl v2.0 (IA Manager)</strong> é uma plataforma centralizada projetada para gerenciar o ciclo de desenvolvimento de software em parceria com Inteligências Artificiais. Seu objetivo é impedir alucinações da IA, manter o contexto do projeto salvo (memória persistente) e garantir que o que foi planejado seja executado fisicamente no código.
        </p>
      </div>

      {/* Seção 1: Dashboard */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#e8ff5a]/30 transition-colors">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gray-800 rounded-xl shrink-0"><FolderKanban className="w-6 h-6 text-gray-300" /></div>
          <div>
            <h2 className="text-lg font-bold text-white mb-2">1. Dashboard & Projetos</h2>
            <p className="text-gray-400 text-sm mb-3"><strong>Para que serve:</strong> A central de comando do gerente. Fornece uma visão panorâmica de todos os softwares e alerta sobre riscos críticos de imediato. A Criação de Projetos define a "Certidão de Nascimento" do software (Stack, Arquivos Críticos, Regras Especiais).</p>
            <p className="text-gray-400 text-sm"><strong>Como usar:</strong> Visualize indicadores de saúde, acesse cards de projetos ou clique em "Novo Projeto" para amarrar as regras que a IA não pode quebrar.</p>
          </div>
        </div>
      </section>

      {/* Seção 2: Sincronização Antigravity */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#e8ff5a]/30 transition-colors">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 rounded-xl shrink-0"><Sparkles className="w-6 h-6 text-[#e8ff5a]" /></div>
          <div>
            <h2 className="text-lg font-bold text-white mb-2">2. Sincronização Antigravity (O Motor Principal)</h2>
            <p className="text-gray-400 text-sm mb-3"><strong>Para que serve:</strong> É o "Polígrafo" da Inteligência Artificial. Garante que as tarefas marcadas como concluídas no roadmap realmente existem no código real do seu computador.</p>
            <p className="text-gray-400 text-sm"><strong>Como usar:</strong> Clique em "Sincronizar Antigravity" dentro do projeto. O motor varre suas pastas locais, cruza a teoria com a prática e atualiza o percentual das fases do projeto com base em provas concretas.</p>
          </div>
        </div>
      </section>

      {/* Seção 3: Módulos do Menu Lateral */}
      <div className="pt-4 border-t border-[#2a2a2a]">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gray-400" /> 
          Módulos do Menu Lateral (Por Projeto)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Extrator */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><Cpu className="w-4 h-4 text-blue-400" /> Extrator IA</h3>
            <p className="text-xs text-gray-400 leading-relaxed"><strong>Para que serve:</strong> Lê código-fonte ou documentações e extrai regras de negócios. <strong>Uso:</strong> Jogue um arquivo de código complexo e peça para a IA traduzir o que aquilo faz.</p>
          </div>

          {/* Card Guard Prompt */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><ShieldCheck className="w-4 h-4 text-green-400" /> Guard Prompt</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-2"><strong>Para que serve:</strong> Evitar que o ChatGPT ou Claude "esqueçam" como o seu aplicativo é feito.</p>
            <p className="text-xs text-gray-400 leading-relaxed"><strong>Quando e Como usar:</strong> Sabe quando você abre uma conversa nova no ChatGPT para pedir um código, e ele te manda o código na linguagem errada ou ignorando o banco de dados que vocês combinaram ontem? Sempre que você for abrir uma <strong>nova conversa</strong> com qualquer IA, você vem aqui, clica em gerar, e ele vai criar um texto gigante. Você <strong>copia e cola esse texto na IA</strong> como sua primeira mensagem. Assim, a IA lê o texto e já sabe exatamente em que pé o projeto está, quais as regras, e não comete erros estúpidos.</p>
          </div>

          {/* Card Checklist */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><CheckSquare className="w-4 h-4 text-purple-400" /> Checklist & Mapa</h3>
            <p className="text-xs text-gray-400 leading-relaxed"><strong>Para que serve:</strong> Divide a construção do software em 6 Fases lógicas. <strong>Uso:</strong> Acompanhe as barras de progresso alimentadas pela Sincronização Antigravity.</p>
          </div>

          {/* Card Vistoria */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><SearchCheck className="w-4 h-4 text-pink-400" /> Vistoria & Roteiro</h3>
            <p className="text-xs text-gray-400 leading-relaxed"><strong>Para que serve:</strong> Auditoria e Planejamento. <strong>Uso:</strong> Desenhe o fluxo de telas (Roteiro) e inspecione se a IA cumpriu os requisitos de interface (Vistoria).</p>
          </div>

          {/* Card Histórico */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><History className="w-4 h-4 text-yellow-400" /> Fonte de Verdade & Histórico</h3>
            <p className="text-xs text-gray-400 leading-relaxed"><strong>Para que serve:</strong> Banco de dados imutável do que foi acordado. <strong>Uso:</strong> Aponte a IA para a Fonte de Verdade se ela inventar coisas novas. Consulte o log de sincronizações.</p>
          </div>

          {/* Card Erros */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><AlertOctagon className="w-4 h-4 text-red-400" /> Log de Erros</h3>
            <p className="text-xs text-gray-400 leading-relaxed"><strong>Para que serve:</strong> Um hospital de bugs crônicos. <strong>Uso:</strong> O AppControl joga erros repetidos aqui para injetar no Guard Prompt e evitar que a IA os cometa de novo.</p>
          </div>
        </div>
      </div>

      {/* Seção 4: Segurança */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 mt-8">
        <h2 className="text-lg font-bold text-red-400 mb-2">🔒 Segurança e Ociosidade (Background)</h2>
        <p className="text-gray-400 text-sm">O sistema roda protegido por um <strong>Escudo de Rotas</strong> (interceptador 401 anti-spam) e um <strong>Vigia de Inatividade</strong> (Tempo Padrão: 30 minutos). A expiração de chave em qualquer aba varre o usuário do aplicativo para prevenir corrupção de código e acessos não autorizados. Estes sistemas operam silenciosamente e garantem padrão de segurança bancário à sua propriedade intelectual.</p>
      </div>

    </div>
  );
};
