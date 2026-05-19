import React, { useState, useMemo } from 'react';
import { useProjetosStore } from '../store/projetos';
import { 
  FileText, Sparkles, Copy, CheckCircle2, AlertCircle, 
  Download, CheckSquare, Square, Terminal, ShieldCheck, FolderKanban, History, Bug
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FonteDeVerdade: React.FC = () => {
  const { projetoAtivo } = useProjetosStore();

  const [secoes, setSecoes] = useState({
    metadados: true,
    guardPrompt: true,
    roadmap: true,
    historico: true,
    erros: true
  });

  const [copiado, setCopiado] = useState(false);

  const toggleSecao = (chave: keyof typeof secoes) => {
    setSecoes(prev => ({ ...prev, [chave]: !prev[chave] }));
  };

  const markdownGerado = useMemo(() => {
    if (!projetoAtivo) return '';

    let md = `# Fonte de Verdade — ${projetoAtivo.nome}\n\n`;
    md += `> Documento mestre de especificação, arquitetura, estado e memória externa do projeto.\n> Gerado automaticamente via **AppControl v1.0** em ${new Date().toLocaleString()}.\n\n---\n\n`;

    // 1. Metadados do Projeto
    if (secoes.metadados) {
      md += `## 📊 1. Metadados e Stack Técnica\n\n`;
      md += `- **ID do Projeto**: \`${projetoAtivo.id}\`\n`;
      md += `- **Nome**: ${projetoAtivo.nome}\n`;
      md += `- **Tipo/Domínio**: ${projetoAtivo.tipo}\n`;
      md += `- **Stack Frontend**: \`${projetoAtivo.stack_fe || 'Não definida'}\`\n`;
      md += `- **Stack Backend**: \`${projetoAtivo.stack_be || 'Não definida'}\`\n`;
      md += `- **IA Base (LLM)**: \`${projetoAtivo.llm_base || 'Gemini (Flash)'}\`\n`;
      md += `- **Progresso Global**: ${projetoAtivo.progresso || 0}%\n\n---\n\n`;
    }

    // 2. Guard Prompt e Regras
    if (secoes.guardPrompt) {
      md += `## 🛡️ 2. Guard Prompt e Regras de Arquitetura\n\n`;
      md += `### Arquivos Críticos Protegidos\n`;
      if (projetoAtivo.arquivos_criticos?.length > 0) {
        md += projetoAtivo.arquivos_criticos.map(a => `- \`${a}\``).join('\n') + '\n\n';
      } else {
        md += `*Nenhum arquivo crítico cadastrado.*\n\n`;
      }

      md += `### Regras Especiais / Restrições de IA\n`;
      md += `\`\`\`text\n${projetoAtivo.regras_especiais || 'Nenhuma regra especial cadastrada.'}\n\`\`\`\n\n---\n\n`;
    }

    // 3. Roadmap e Fases
    if (secoes.roadmap) {
      md += `## 🗺️ 3. Roadmap de Execução\n\n`;
      md += `| Ordem | Fase | Status | Progresso |\n`;
      md += `| :---: | :--- | :---: | :---: |\n`;
      if (projetoAtivo.fases && projetoAtivo.fases.length > 0) {
        projetoAtivo.fases.forEach(f => {
          const status = f.percentual === 100 ? '✅ CONCLUÍDO' : f.percentual > 0 ? '⏳ EM ANDAMENTO' : '📌 PENDENTE';
          md += `| ${f.ordem} | **${f.nome}** | ${status} | ${f.percentual}% |\n`;
        });
        md += '\n';
      } else {
        md += `| - | *Nenhuma fase encontrada* | - | - |\n\n`;
      }
      md += `---\n\n`;
    }

    // 4. Histórico de Sessões
    if (secoes.historico) {
      md += `## 🕰️ 4. Memória Externa e Histórico de Sessões (${projetoAtivo.sessoes?.length || 0})\n\n`;
      if (projetoAtivo.sessoes && projetoAtivo.sessoes.length > 0) {
        projetoAtivo.sessoes.forEach((s, i) => {
          md += `### Sessão #${projetoAtivo.sessoes!.length - i} — ${s.data ? new Date(s.data).toLocaleDateString() : 'N/A'} (${s.status.toUpperCase()})\n\n`;
          md += `**Resumo**: ${s.resumo || 'Sem resumo'}\n\n`;
          md += `**Arquivos Modificados**: ${s.arquivos_tocados?.map(a => `\`${a}\``).join(', ') || '*Nenhum*'}\n\n`;
          
          if (s.o_que_foi_feito?.length > 0) {
            md += `**O Que Foi Feito**:\n` + s.o_que_foi_feito.map(item => `- ${item}`).join('\n') + '\n\n';
          }
          if (s.proximos_passos?.length > 0) {
            md += `**Próximos Passos**:\n` + s.proximos_passos.map(item => `- ${item}`).join('\n') + '\n\n';
          }
        });
      } else {
        md += `*Nenhuma sessão registrada para este projeto ainda.*\n\n`;
      }
      md += `---\n\n`;
    }

    // 5. Log de Erros
    if (secoes.erros) {
      md += `## 🐛 5. Log de Incidentes e Falhas Conhecidas (${projetoAtivo.erros?.length || 0})\n\n`;
      if (projetoAtivo.erros && projetoAtivo.erros.length > 0) {
        projetoAtivo.erros.forEach((e, i) => {
          md += `### Erro #${i + 1} — [${e.tipo || 'Geral'}] \`${e.arquivo || 'Desconhecido'}\`\n\n`;
          md += `**Data**: ${e.data ? new Date(e.data).toLocaleString() : 'N/A'}\n\n`;
          md += `**Descrição do Problema**:\n\`\`\`text\n${e.descricao}\n\`\`\`\n\n`;
          if (e.solucao) {
            md += `**Solução Proposta / Status**:\n> ${e.solucao}\n\n`;
          }
        });
      } else {
        md += `*Nenhum erro registrado para este projeto.*\n\n`;
      }
    }

    return md;
  }, [projetoAtivo, secoes]);

  const handleCopiar = () => {
    if (!markdownGerado) return;
    navigator.clipboard.writeText(markdownGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  const handleDownload = () => {
    if (!markdownGerado || !projetoAtivo) return;
    const blob = new Blob([markdownGerado], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fonte_de_verdade_${projetoAtivo.nome.toLowerCase().replace(/\s+/g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!projetoAtivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 animate-fade-in font-sans">
        <AlertCircle className="w-12 h-12 text-[#e8ff5a]" />
        <h3 className="text-xl font-bold text-white">Nenhum Projeto Ativo Selecionado</h3>
        <p className="text-sm text-gray-400 font-mono max-w-md">
          Para gerar o artefato definitivo <code className="text-[#e8ff5a]">fonte_de_verdade.md</code>, selecione ou crie um projeto no Dashboard ou na Sidebar.
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
                <Sparkles className="w-3.5 h-3.5" /> Artefato Definitivo
              </span>
              <span className="text-xs text-gray-500 font-mono">Projeto: {projetoAtivo.nome}</span>
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Gerador de <code className="text-[#e8ff5a] font-mono bg-[#0d0d0d] px-3 py-1 rounded-lg border border-[#2a2a2a]">fonte_de_verdade.md</code>
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Consolide todas as especificações, regras, roadmap, histórico e erros em um único arquivo Markdown.
            </p>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-4">
            <FileText className="w-8 h-8 text-[#e8ff5a]" />
            <div>
              <div className="text-xs text-gray-400 font-mono">Tamanho Estimado</div>
              <div className="text-sm font-bold text-[#e8ff5a] font-mono">{(markdownGerado.length / 1024).toFixed(1)} KB</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal: Seletores e Exibição do Markdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Painel Esquerdo: Seletores de Seção */}
        <div className="lg:col-span-5 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl">
          <div className="border-b border-[#2a2a2a] pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <Terminal className="w-5 h-5 text-[#e8ff5a]" /> Seções do Documento
            </h3>
            <p className="text-xs text-gray-400 mt-1 font-mono">Marque quais módulos deseja incluir na exportação</p>
          </div>

          <div className="space-y-4">
            {/* 1. Metadados */}
            <div 
              onClick={() => toggleSecao('metadados')}
              className={`p-5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                secoes.metadados ? 'bg-[#0d0d0d] border-[#e8ff5a]' : 'bg-[#0d0d0d]/50 border-[#2a2a2a] opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <FolderKanban className={`w-5 h-5 ${secoes.metadados ? 'text-[#e8ff5a]' : 'text-gray-500'}`} />
                <div>
                  <div className="text-sm font-bold text-white font-mono">1. Metadados e Stacks</div>
                  <div className="text-xs text-gray-400 font-sans">Nome, tipo, stacks FE/BE, LLM e progresso</div>
                </div>
              </div>
              {secoes.metadados ? <CheckSquare className="w-5 h-5 text-[#e8ff5a]" /> : <Square className="w-5 h-5 text-gray-500" />}
            </div>

            {/* 2. Guard Prompt */}
            <div 
              onClick={() => toggleSecao('guardPrompt')}
              className={`p-5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                secoes.guardPrompt ? 'bg-[#0d0d0d] border-[#e8ff5a]' : 'bg-[#0d0d0d]/50 border-[#2a2a2a] opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <ShieldCheck className={`w-5 h-5 ${secoes.guardPrompt ? 'text-[#e8ff5a]' : 'text-gray-500'}`} />
                <div>
                  <div className="text-sm font-bold text-white font-mono">2. Guard Prompt</div>
                  <div className="text-xs text-gray-400 font-sans">Arquivos críticos protegidos e regras especiais</div>
                </div>
              </div>
              {secoes.guardPrompt ? <CheckSquare className="w-5 h-5 text-[#e8ff5a]" /> : <Square className="w-5 h-5 text-gray-500" />}
            </div>

            {/* 3. Roadmap */}
            <div 
              onClick={() => toggleSecao('roadmap')}
              className={`p-5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                secoes.roadmap ? 'bg-[#0d0d0d] border-[#e8ff5a]' : 'bg-[#0d0d0d]/50 border-[#2a2a2a] opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <FileText className={`w-5 h-5 ${secoes.roadmap ? 'text-[#e8ff5a]' : 'text-gray-500'}`} />
                <div>
                  <div className="text-sm font-bold text-white font-mono">3. Roadmap de Execução</div>
                  <div className="text-xs text-gray-400 font-sans">Tabela de fases, ordem e percentuais de conclusão</div>
                </div>
              </div>
              {secoes.roadmap ? <CheckSquare className="w-5 h-5 text-[#e8ff5a]" /> : <Square className="w-5 h-5 text-gray-500" />}
            </div>

            {/* 4. Histórico */}
            <div 
              onClick={() => toggleSecao('historico')}
              className={`p-5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                secoes.historico ? 'bg-[#0d0d0d] border-[#e8ff5a]' : 'bg-[#0d0d0d]/50 border-[#2a2a2a] opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <History className={`w-5 h-5 ${secoes.historico ? 'text-[#e8ff5a]' : 'text-gray-500'}`} />
                <div>
                  <div className="text-sm font-bold text-white font-mono">4. Histórico de Sessões</div>
                  <div className="text-xs text-gray-400 font-sans">Memória externa cumulativa e decisões da IA</div>
                </div>
              </div>
              {secoes.historico ? <CheckSquare className="w-5 h-5 text-[#e8ff5a]" /> : <Square className="w-5 h-5 text-gray-500" />}
            </div>

            {/* 5. Erros */}
            <div 
              onClick={() => toggleSecao('erros')}
              className={`p-5 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                secoes.erros ? 'bg-[#0d0d0d] border-[#e8ff5a]' : 'bg-[#0d0d0d]/50 border-[#2a2a2a] opacity-60'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Bug className={`w-5 h-5 ${secoes.erros ? 'text-[#e8ff5a]' : 'text-gray-500'}`} />
                <div>
                  <div className="text-sm font-bold text-white font-mono">5. Log de Erros</div>
                  <div className="text-xs text-gray-400 font-sans">Registro de incidentes e soluções propostas</div>
                </div>
              </div>
              {secoes.erros ? <CheckSquare className="w-5 h-5 text-[#e8ff5a]" /> : <Square className="w-5 h-5 text-gray-500" />}
            </div>
          </div>

          <div className="pt-4 border-t border-[#2a2a2a] space-y-3">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full py-3 bg-[#e8ff5a] text-[#0d0d0d] font-bold rounded-xl hover:bg-[#d4eb45] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-[#e8ff5a]/10 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo (.md)</span>
            </button>
          </div>
        </div>

        {/* Painel Direito: Exibição do Markdown Gerado */}
        <div className="lg:col-span-7 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl flex flex-col h-full min-h-[600px]">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <Terminal className="w-5 h-5 text-[#e8ff5a]" /> Pré-visualização do Documento
            </h3>

            <button
              type="button"
              onClick={handleCopiar}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg cursor-pointer ${
                copiado 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-[#e8ff5a] text-[#0d0d0d] hover:bg-[#d4eb45] shadow-[#e8ff5a]/10'
              }`}
            >
              {copiado ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiado ? 'Copiado com Sucesso!' : 'Copiar Tudo'}</span>
            </button>
          </div>

          <div className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl p-6 relative group flex flex-col">
            <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-y-auto max-h-[650px] select-all leading-relaxed w-full flex-1">
              {markdownGerado}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
