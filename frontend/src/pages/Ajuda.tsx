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
            <h1 className="text-2xl font-bold text-white tracking-tight">Ajuda Contínua: O Jeito Fácil de Entender</h1>
            <p className="text-sm text-gray-400 font-mono mt-1">Esqueça o jargão. Veja como a plataforma realmente funciona.</p>
          </div>
        </div>
        <p className="text-gray-400 mt-4 max-w-3xl leading-relaxed">
          O <strong>AppControl v2.0</strong> não é uma ferramenta mágica, é uma construtora. Quando você programa usando Inteligência Artificial (ChatGPT, Claude), você é o Dono da Obra e a IA é o Pedreiro. O problema é que o pedreiro esquece as coisas, mente que fez o trabalho e tenta inventar moda. O AppControl é o seu conjunto de ferramentas para vigiar, auditar e garantir que o pedreiro faça exatamente o que foi mandado.
        </p>
      </div>

      {/* Seção 1: Dashboard */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#e8ff5a]/30 transition-colors">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gray-800 rounded-xl shrink-0"><FolderKanban className="w-6 h-6 text-gray-300" /></div>
          <div>
            <h2 className="text-lg font-bold text-white mb-2">1. Projetos (A Certidão de Nascimento)</h2>
            <p className="text-gray-400 text-sm mb-3"><strong>Para que serve:</strong> É onde você diz pro pedreiro quais os materiais que ele PODE usar e quais são proibidos.</p>
            <p className="text-gray-400 text-sm"><strong>Como usar:</strong> Quando você cria um projeto, você amarra as regras da obra. Se você disser "O backend é em Python" e amanhã a IA tentar escrever código em PHP, o AppControl vai bloquear e avisar que o pedreiro está usando o tijolo errado.</p>
          </div>
        </div>
      </section>

      {/* Seção 2: Sincronização Antigravity */}
      <section className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#e8ff5a]/30 transition-colors">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 rounded-xl shrink-0"><Sparkles className="w-6 h-6 text-[#e8ff5a]" /></div>
          <div>
            <h2 className="text-lg font-bold text-white mb-2">2. Sincronização Antigravity (O Mestre de Obras)</h2>
            <p className="text-gray-400 text-sm mb-3"><strong>Para que serve:</strong> Pegar o pedreiro (IA) na mentira. A IA adora dizer que terminou uma tela, mas às vezes o código nem existe na pasta.</p>
            <p className="text-gray-400 text-sm"><strong>Como usar:</strong> Apertou o botão "Sincronizar", o AppControl vai no disco rígido do seu computador com uma fita métrica. Ele olha os arquivos reais e joga na cara da IA: "Você disse que o login tá pronto, mas o arquivo login.py não existe!". Ele corrige o progresso do seu projeto baseado na realidade, e não na teoria.</p>
          </div>
        </div>
      </section>

      {/* Seção 3: Módulos do Menu Lateral */}
      <div className="pt-4 border-t border-[#2a2a2a]">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gray-400" /> 
          As Ferramentas da Construtora (Menu Lateral)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card Guard Prompt */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5 md:col-span-2">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><ShieldCheck className="w-5 h-5 text-green-400" /> Guard Prompt (A Planta Baixa)</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4"><strong>O Problema:</strong> O pedreiro (IA) tem Alzheimer. Toda vez que você abre um "Novo Chat" com ele, ele não lembra de nada do projeto.</p>
            
            <div className="bg-[#1a1a1a] p-4 rounded-lg mb-4">
              <h4 className="text-xs font-bold text-gray-300 uppercase mb-2">O que tem dentro do Prompt? (Os Detalhes)</h4>
              <p className="text-xs text-gray-400 mb-2">O sistema vai no banco de dados e junta 5 blocos de informação em um único textão:</p>
              <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
                <li>O Contexto do projeto e a Stack Tecnológica (Ex: React, Node).</li>
                <li>As Leis Primordiais que você escreveu.</li>
                <li>O andamento atual das fases (O Roadmap).</li>
                <li>A lista dos Arquivos Críticos mapeados no disco.</li>
                <li>O Log de Erros (para a IA não repetir as mesmas burradas).</li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-4 rounded-lg border-l-2 border-green-500">
              <h4 className="text-xs font-bold text-green-400 uppercase mb-2">Passo a Passo (Como usar na prática)</h4>
              <ol className="list-decimal list-inside text-xs text-gray-300 space-y-2 font-mono">
                <li>Acesse o menu lateral <strong>Guard Prompt</strong> ou <strong>Briefing</strong>.</li>
                <li>Clique no botão amarelo <strong>Gerar Briefing Completo</strong>.</li>
                <li>O sistema vai compilar o texto. Clique em <strong>Copiar</strong>.</li>
                <li>Abra uma conversa VAZIA (Novo Chat) no ChatGPT, Claude ou Cursor.</li>
                <li>Cole esse texto gigante e mande. A IA vai ler e "lembrar" de tudo.</li>
                <li>Aguarde a IA responder "Entendido". Só então, faça seu pedido de código.</li>
              </ol>
            </div>
          </div>

          {/* Card Extrator */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><Cpu className="w-4 h-4 text-blue-400" /> Extrator IA (O Tradutor)</h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-2"><strong>O Problema:</strong> Você pegou um código gigantesco na internet ou de outro desenvolvedor e não faz ideia do que ele faz.</p>
            <p className="text-xs text-gray-400 leading-relaxed"><strong>A Solução:</strong> Jogue o arquivo de código no Extrator. Ele mastiga o código e te cospe um resumo em português claro dizendo exatamente para que aquele código serve e como usá-lo.</p>
          </div>

          {/* Card Checklist */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><CheckSquare className="w-4 h-4 text-purple-400" /> Checklist & Mapa (O Cronograma)</h3>
            <p className="text-xs text-gray-400 leading-relaxed"><strong>O Problema:</strong> A IA tenta pintar a parede antes de colocar os tijolos. <br/><br/><strong>A Solução:</strong> O Mapa divide sua obra em 6 fases obrigatórias (Fundação, Backend, Frontend...). Você acompanha o andamento em barras de porcentagem para garantir que a IA não pule etapas.</p>
          </div>

          {/* Card Vistoria */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><SearchCheck className="w-4 h-4 text-pink-400" /> Vistoria & Roteiro (O Auditor)</h3>
            <p className="text-xs text-gray-400 leading-relaxed"><strong>O Problema:</strong> Você pediu uma tela de login com esqueci a senha, mas a IA esqueceu o botão.<br/><br/><strong>A Solução:</strong> No Roteiro você desenha o caminho do usuário. Na Vistoria, o AppControl age como um inspetor de qualidade que testa a tela para confirmar se o botão realmente está lá.</p>
          </div>

          {/* Card Histórico */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><History className="w-4 h-4 text-yellow-400" /> Fonte de Verdade (O Cartório)</h3>
            <p className="text-xs text-gray-400 leading-relaxed"><strong>O Problema:</strong> A IA começa a inventar funcionalidades ("alucinar") que nunca foram pedidas.<br/><br/><strong>A Solução:</strong> O que está na Fonte de Verdade é a lei do projeto. Se a IA viajar na maionese, você aponta para a Fonte de Verdade e diz: "Siga o que está no cartório, nada mais."</p>
          </div>

          {/* Card Erros */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><AlertOctagon className="w-4 h-4 text-red-400" /> Log de Erros (O Mural da Vergonha)</h3>
            <p className="text-xs text-gray-400 leading-relaxed"><strong>O Problema:</strong> A IA comete o mesmo erro idiota três vezes seguidas.<br/><br/><strong>A Solução:</strong> Os erros são anotados aqui. Quando você for gerar a Planta Baixa (Guard Prompt) pro dia seguinte, o Mural anexa o aviso: "Cuidado, você costuma errar a conexão com o banco, não faça isso de novo."</p>
          </div>
        </div>
      </div>

      {/* Seção 4: Segurança */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 mt-8">
        <h2 className="text-lg font-bold text-red-400 mb-2">🔒 Segurança do Bunker (Background)</h2>
        <p className="text-gray-400 text-sm">O aplicativo funciona como um cofre de banco. O "Escudo" é o segurança da porta giratória que joga você para fora se o seu crachá (token) for falso. O "Vigia" é o segurança que desliga as luzes e tranca tudo se você esquecer o computador ligado e sair para tomar café (Padrão de 30 minutos de inatividade). Você não precisa fazer nada, eles trabalham em silêncio.</p>
      </div>

    </div>
  );
};
