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

      {/* Seção 0: A Rotina Prática */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-blue-400 mb-4">A Rotina Diária do Dono da Obra (Para Não-Programadores)</h2>
        <p className="text-sm text-gray-300 mb-6">Você não precisa entender de código para gerenciar o projeto. Você só precisa seguir estes 4 passos básicos no seu dia a dia:</p>
        
        <div className="space-y-4">
          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a]">
            <h3 className="text-white font-bold mb-1">🌞 1. Começando o Dia (O Guard Prompt)</h3>
            <p className="text-xs text-gray-400"><strong>Quando usar:</strong> Toda vez que for abrir um "Novo Chat" com a IA para pedir uma funcionalidade nova.</p>
            <p className="text-xs text-gray-400"><strong>Ação:</strong> Gere o texto gigante no Guard Prompt do AppControl, cole no chat vazio do ChatGPT e diga "Leia isso antes de começarmos". Só depois faça o seu pedido.</p>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a]">
            <h3 className="text-white font-bold mb-1">🧱 2. O Teste Visual (A Vistoria Simples)</h3>
            <p className="text-xs text-gray-400"><strong>Quando usar:</strong> Quando a IA te der um código e mandar você colar no arquivo.</p>
            <p className="text-xs text-gray-400"><strong>Ação:</strong> Você copia, cola e abre o seu aplicativo localmente. Se a tela abrir bonita, a IA acertou. Se a tela ficar toda branca ou explodir erro, a IA errou feio.</p>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a]">
            <h3 className="text-white font-bold mb-1">📝 3. Alimentando o Mural da Vergonha (Log de Erros)</h3>
            <p className="text-xs text-gray-400"><strong>Quando usar:</strong> Quando a IA fez merda (a tela ficou branca) e você teve que brigar com ela no chat para consertar.</p>
            <p className="text-xs text-gray-400"><strong>Ação:</strong> Quando a IA confessar o erro (ex: "Desculpe, esqueci o botão azul"), vá no AppControl (Log de Erros) e anote com suas palavras: "A IA esquece o botão azul". Isso vai entrar no Guard Prompt de amanhã para ela não esquecer mais.</p>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a]">
            <h3 className="text-white font-bold mb-1">🔄 4. Fim do Expediente (Sincronização)</h3>
            <p className="text-xs text-gray-400"><strong>Quando usar:</strong> No fim do dia ou quando uma tela grande ficar pronta.</p>
            <p className="text-xs text-gray-400"><strong>Ação:</strong> Clique em Sincronizar Antigravity. O sistema vai varrer seu computador, achar os arquivos que você colou hoje e subir a barra de progresso oficial do seu projeto.</p>
          </div>
        </div>
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
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5 md:col-span-2">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><Cpu className="w-5 h-5 text-blue-400" /> Extrator IA (O Tradutor)</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4"><strong>O Problema:</strong> Você pegou um código gigantesco na internet ou de outro desenvolvedor e não faz ideia do que ele faz nem por onde começar a ler.</p>
            
            <div className="bg-[#1a1a1a] p-4 rounded-lg mb-4">
              <h4 className="text-xs font-bold text-gray-300 uppercase mb-2">Os Detalhes (O que ele mastiga?)</h4>
              <p className="text-xs text-gray-400 mb-2">Você joga o código bruto e a IA isola três coisas cirúrgicas para você:</p>
              <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
                <li><strong>Regras de Negócio:</strong> "Esse código calcula a taxa de juros se atrasar 5 dias".</li>
                <li><strong>Rotas:</strong> "Esse código tenta conversar com a URL /api/usuarios".</li>
                <li><strong>Dependências:</strong> "Você precisa instalar a biblioteca X para isso rodar".</li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-4 rounded-lg border-l-2 border-blue-500">
              <h4 className="text-xs font-bold text-blue-400 uppercase mb-2">Passo a Passo Prático</h4>
              <ol className="list-decimal list-inside text-xs text-gray-300 space-y-2 font-mono">
                <li>Vá no menu lateral <strong>Extrator IA</strong>.</li>
                <li>No campo da esquerda, cole o arquivo de código cru.</li>
                <li>Clique no botão de <strong>Analisar / Extrair</strong>.</li>
                <li>O painel da direita vai se preencher com o resumo mastigado em português.</li>
              </ol>
            </div>
          </div>

          {/* Card Checklist */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5 md:col-span-2">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><CheckSquare className="w-5 h-5 text-purple-400" /> Checklist & Mapa (O Cronograma)</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4"><strong>O Problema:</strong> A IA tenta pintar a parede antes de colocar os tijolos, pulando a configuração de banco de dados e indo direto pra tela.</p>
            
            <div className="bg-[#1a1a1a] p-4 rounded-lg mb-4">
              <h4 className="text-xs font-bold text-gray-300 uppercase mb-2">Os Detalhes (A Divisão Obrigatória)</h4>
              <p className="text-xs text-gray-400 mb-2">Sua obra é dividida em 6 fases de engenharia inquebráveis:</p>
              <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
                <li>1. Fundação (Repositório) / 2. Backend / 3. Frontend</li>
                <li>4. Integração / 5. Testes / 6. Deploy</li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-4 rounded-lg border-l-2 border-purple-500">
              <h4 className="text-xs font-bold text-purple-400 uppercase mb-2">Passo a Passo Prático</h4>
              <ol className="list-decimal list-inside text-xs text-gray-300 space-y-2 font-mono">
                <li>Vá na aba <strong>Checklist</strong> ou <strong>Mapa</strong>.</li>
                <li>Verifique a porcentagem (alimentada pelo motor Antigravity).</li>
                <li>Se a Fase 1 estiver em 50%, <strong>NÃO PEÇA</strong> telas para a IA hoje. Peça apenas tarefas da Fase 1 até cravar 100%.</li>
              </ol>
            </div>
          </div>

          {/* Card Vistoria */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5 md:col-span-2">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><SearchCheck className="w-5 h-5 text-pink-400" /> Vistoria & Roteiro (O Auditor)</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4"><strong>O Problema:</strong> Você pediu uma tela de login com "esqueci a senha", mas a IA esqueceu o botão e você só descobriu na produção.</p>
            
            <div className="bg-[#1a1a1a] p-4 rounded-lg mb-4">
              <h4 className="text-xs font-bold text-gray-300 uppercase mb-2">Os Detalhes (Desenho vs. Teste)</h4>
              <p className="text-xs text-gray-400 mb-2">O <strong>Roteiro</strong> é onde você desenha o caminho (ex: Entra no site - Clica no botão - Vê o painel). A <strong>Vistoria</strong> é o teste de estresse contra esse caminho.</p>
            </div>

            <div className="bg-[#1a1a1a] p-4 rounded-lg border-l-2 border-pink-500">
              <h4 className="text-xs font-bold text-pink-400 uppercase mb-2">Passo a Passo Prático</h4>
              <ol className="list-decimal list-inside text-xs text-gray-300 space-y-2 font-mono">
                <li>Crie um Roteiro descrevendo o que a tela deveria fazer.</li>
                <li>Na Vistoria, jogue a tela pronta e mande a ferramenta auditar.</li>
                <li>Ela vai ler o código da tela e avisar: "Faltou o botão de redefinir senha".</li>
              </ol>
            </div>
          </div>

          {/* Card Histórico */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5 md:col-span-2">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><History className="w-5 h-5 text-yellow-400" /> Fonte de Verdade (O Cartório)</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4"><strong>O Problema:</strong> A IA começa a "alucinar", mudar a arquitetura no meio do caminho ou dizer que você pediu coisas que nunca pediu.</p>
            
            <div className="bg-[#1a1a1a] p-4 rounded-lg border-l-2 border-yellow-500">
              <h4 className="text-xs font-bold text-yellow-400 uppercase mb-2">Passo a Passo Prático</h4>
              <ol className="list-decimal list-inside text-xs text-gray-300 space-y-2 font-mono">
                <li>A Fonte de Verdade é um documento cravado em pedra do que foi acordado.</li>
                <li>Se a IA tentar fugir do escopo no ChatGPT, você não perde tempo argumentando.</li>
                <li>Você copia as diretrizes da Fonte de Verdade, cola no chat e diz: <strong>"Siga o que está aqui, pare de inventar."</strong></li>
              </ol>
            </div>
          </div>

          {/* Card Erros */}
          <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-5 md:col-span-2">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2"><AlertOctagon className="w-5 h-5 text-red-400" /> Log de Erros (O Mural da Vergonha)</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4"><strong>O Problema:</strong> A IA comete exatamente o mesmo erro técnico estúpido em três telas diferentes, gastando seu tempo e paciência.</p>
            
            <div className="bg-[#1a1a1a] p-4 rounded-lg border-l-2 border-red-500">
              <h4 className="text-xs font-bold text-red-400 uppercase mb-2">Passo a Passo Prático</h4>
              <ol className="list-decimal list-inside text-xs text-gray-300 space-y-2 font-mono">
                <li>A IA errou feio? Vá no <strong>Log de Erros</strong>.</li>
                <li>Adicione um novo erro descrevendo a cagada (Ex: "Esqueceu de importar o Auth no Header").</li>
                <li>Esse erro fica salvo no banco de dados.</li>
                <li>Amanhã, ao gerar um <strong>Guard Prompt</strong>, esse erro vai injetado no aviso: "ATENÇÃO, IA: Você tem histórico de esquecer o Auth, preste atenção!".</li>
              </ol>
            </div>
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
