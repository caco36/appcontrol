import React, { useState } from 'react';
import { useProjetosStore } from '../store/projetos';
import { 
  CheckSquare, Sparkles, Copy, CheckCircle2, AlertCircle, 
  FileCheck, FileX, ListChecks, ShieldAlert, Terminal, Plus, Trash2, Hash, Flag
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Checklist: React.FC = () => {
  const { projetoAtivo } = useProjetosStore();

  const [numeroTarefa, setNumeroTarefa] = useState('001');
  const [prioridade, setPrioridade] = useState('Alta');
  const [descricao, setDescricao] = useState('');

  const [arquivosPermitidos, setArquivosPermitidos] = useState<string[]>([]);
  const [novoPermitido, setNovoPermitido] = useState('');

  const [arquivosProibidos, setArquivosProibidos] = useState<string[]>([]);
  const [novoProibido, setNovoProibido] = useState('');

  const [criteriosAceitacao, setCriteriosAceitacao] = useState<string[]>([]);
  const [novoCriterio, setNovoCriterio] = useState('');

  const [restricoes, setRestricoes] = useState<string[]>([]);
  const [novaRestricao, setNovaRestricao] = useState('');

  const [checklistGerado, setChecklistGerado] = useState<string>('');
  const [copiado, setCopiado] = useState(false);

  const handleAddItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>, 
    list: string[], 
    input: string, 
    setInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (input.trim() && !list.includes(input.trim())) {
      setter([...list, input.trim()]);
      setInput('');
    }
  };

  const handleRemoveItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>, 
    list: string[], 
    index: number
  ) => {
    setter(list.filter((_, i) => i !== index));
  };

  const handleGerarChecklist = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const prompt = `[AppControl v1.0 — Checklist de Tarefa Estruturado]
PROJETO ATIVO: ${projetoAtivo?.nome || 'Nenhum selecionado'}
TAREFA # ${numeroTarefa}
PRIORIDADE: ${prioridade}

================================================================================
DESCRIÇÃO DA TAREFA
================================================================================
${descricao.trim() || 'Nenhuma descrição fornecida.'}

================================================================================
ARQUIVOS PERMITIDOS PARA EDIÇÃO
================================================================================
${arquivosPermitidos.length > 0 ? arquivosPermitidos.map(arq => `[ ] ${arq}`).join('\n') : '[ ] (Qualquer arquivo necessário, respeitando o Guard Prompt)'}

================================================================================
ARQUIVOS PROIBIDOS (INTOCÁVEIS NESTA TAREFA)
================================================================================
${arquivosProibidos.length > 0 ? arquivosProibidos.map(arq => `- ${arq}`).join('\n') : '- Nenhum arquivo proibido específico para esta tarefa.'}

================================================================================
CRITÉRIOS DE ACEITAÇÃO (O QUE DEFINE O SUCESSO)
================================================================================
${criteriosAceitacao.length > 0 ? criteriosAceitacao.map((crit, i) => `${i + 1}. [ ] ${crit}`).join('\n') : '1. [ ] Concluir a implementação sem erros de compilação ou lint.'}

================================================================================
RESTRIÇÕES TÉCNICAS E ARQUITETURAIS
================================================================================
${restricoes.length > 0 ? restricoes.map(rest => `- ${rest}`).join('\n') : '- Seguir estritamente as regras de Clean Code e arquitetura do projeto.'}

================================================================================
INSTRUÇÕES FINAIS PARA A IA
================================================================================
1. Analise o escopo e os critérios acima antes de escrever qualquer código.
2. Certifique-se de não tocar nos arquivos proibidos.
3. Ao finalizar, apresente um relatório confirmando cada critério de aceitação concluído.`;

    setChecklistGerado(prompt);
  };

  const handleCopiar = () => {
    if (!checklistGerado) return;
    navigator.clipboard.writeText(checklistGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  };

  if (!projetoAtivo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4 animate-fade-in font-sans">
        <AlertCircle className="w-12 h-12 text-yellow-500" />
        <h3 className="text-xl font-bold text-white">Nenhum Projeto Ativo Selecionado</h3>
        <p className="text-sm text-gray-400 font-mono max-w-md">
          Para configurar e gerar o Checklist de Tarefa, selecione ou crie um projeto no Dashboard ou na Sidebar.
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
          <CheckSquare className="w-48 h-48 text-[#e8ff5a]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-[#2a2a2a]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 text-[#e8ff5a] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Gestão de Tarefa
              </span>
              <span className="text-xs text-gray-500 font-mono">Projeto: {projetoAtivo.nome}</span>
            </div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              Módulo Checklist de Tarefa
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-mono">
              Crie especificações de tarefas estruturadas com critérios de aceitação e controle de arquivos permitidos/proibidos.
            </p>
          </div>

          <div className="bg-[#0d0d0d] p-4 rounded-xl border border-[#2a2a2a] flex items-center gap-4">
            <ListChecks className="w-8 h-8 text-[#e8ff5a]" />
            <div>
              <div className="text-xs text-gray-400 font-mono">Status do Gerador</div>
              <div className="text-sm font-bold text-green-400 font-mono">Pronto para Compilar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Formulário e Exibição do Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulário de Especificação */}
        <form onSubmit={(e) => handleGerarChecklist(e)} className="lg:col-span-6 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-[#2a2a2a] pb-4 font-mono">
            <Terminal className="w-5 h-5 text-[#e8ff5a]" /> Especificação da Tarefa
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-400" /> Número da Tarefa
              </label>
              <input
                type="text"
                value={numeroTarefa}
                onChange={(e) => setNumeroTarefa(e.target.value)}
                placeholder="Ex: 001"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
                <Flag className="w-4 h-4 text-yellow-400" /> Prioridade
              </label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans text-sm cursor-pointer"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e8ff5a]" /> Descrição da Tarefa
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o que precisa ser feito de forma clara e objetiva..."
              rows={4}
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans text-sm resize-y"
            />
          </div>

          {/* Arquivos Permitidos */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-green-400" /> Arquivos Permitidos para Edição
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={novoPermitido}
                onChange={(e) => setNovoPermitido(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem(setArquivosPermitidos, arquivosPermitidos, novoPermitido, setNovoPermitido))}
                placeholder="Ex: frontend/src/pages/Login.tsx"
                className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => handleAddItem(setArquivosPermitidos, arquivosPermitidos, novoPermitido, setNovoPermitido)}
                className="px-4 py-3 bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] hover:text-[#e8ff5a] rounded-xl font-bold transition-all flex items-center gap-1 text-xs uppercase tracking-wider shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {arquivosPermitidos.length > 0 ? (
                arquivosPermitidos.map((arq, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0d0d0d] border border-[#2a2a2a] text-green-400 rounded-lg font-mono text-xs group">
                    <span>{arq}</span>
                    <button type="button" onClick={() => handleRemoveItem(setArquivosPermitidos, arquivosPermitidos, idx)} className="text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : <span className="text-gray-500 font-mono text-xs italic">Nenhum arquivo permitido listado (livre, respeitando Guard Prompt).</span>}
            </div>
          </div>

          {/* Arquivos Proibidos */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <FileX className="w-4 h-4 text-red-400" /> Arquivos Proibidos (Intocáveis)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={novoProibido}
                onChange={(e) => setNovoProibido(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem(setArquivosProibidos, arquivosProibidos, novoProibido, setNovoProibido))}
                placeholder="Ex: backend/app/main.py"
                className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => handleAddItem(setArquivosProibidos, arquivosProibidos, novoProibido, setNovoProibido)}
                className="px-4 py-3 bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] hover:text-[#e8ff5a] rounded-xl font-bold transition-all flex items-center gap-1 text-xs uppercase tracking-wider shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {arquivosProibidos.length > 0 ? (
                arquivosProibidos.map((arq, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0d0d0d] border border-[#2a2a2a] text-red-400 rounded-lg font-mono text-xs group">
                    <span>{arq}</span>
                    <button type="button" onClick={() => handleRemoveItem(setArquivosProibidos, arquivosProibidos, idx)} className="text-gray-500 hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : <span className="text-gray-500 font-mono text-xs italic">Nenhum arquivo proibido listado.</span>}
            </div>
          </div>

          {/* Critérios de Aceitação */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-purple-400" /> Critérios de Aceitação
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={novoCriterio}
                onChange={(e) => setNovoCriterio(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem(setCriteriosAceitacao, criteriosAceitacao, novoCriterio, setNovoCriterio))}
                placeholder="Ex: O formulário deve validar campos obrigatórios."
                className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans text-sm"
              />
              <button
                type="button"
                onClick={() => handleAddItem(setCriteriosAceitacao, criteriosAceitacao, novoCriterio, setNovoCriterio)}
                className="px-4 py-3 bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] hover:text-[#e8ff5a] rounded-xl font-bold transition-all flex items-center gap-1 text-xs uppercase tracking-wider shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              {criteriosAceitacao.length > 0 ? (
                criteriosAceitacao.map((crit, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] text-gray-300 rounded-xl font-sans text-sm group">
                    <span className="flex items-center gap-2">
                      <span className="text-[#e8ff5a] font-bold font-mono">{idx + 1}.</span> {crit}
                    </span>
                    <button type="button" onClick={() => handleRemoveItem(setCriteriosAceitacao, criteriosAceitacao, idx)} className="text-gray-500 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : <span className="text-gray-500 font-mono text-xs italic">Nenhum critério adicionado.</span>}
            </div>
          </div>

          {/* Restrições Técnicas */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-400" /> Restrições Técnicas
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={novaRestricao}
                onChange={(e) => setNovaRestricao(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem(setRestricoes, restricoes, novaRestricao, setNovaRestricao))}
                placeholder="Ex: Não utilizar bibliotecas externas adicionais."
                className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#e8ff5a] transition-colors font-sans text-sm"
              />
              <button
                type="button"
                onClick={() => handleAddItem(setRestricoes, restricoes, novaRestricao, setNovaRestricao)}
                className="px-4 py-3 bg-[#2a2a2a] text-white hover:bg-[#3a3a3a] hover:text-[#e8ff5a] rounded-xl font-bold transition-all flex items-center gap-1 text-xs uppercase tracking-wider shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              {restricoes.length > 0 ? (
                restricoes.map((rest, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2.5 bg-[#0d0d0d] border border-[#2a2a2a] text-gray-300 rounded-xl font-sans text-sm group">
                    <span className="flex items-center gap-2">
                      <span className="text-orange-400 font-bold">•</span> {rest}
                    </span>
                    <button type="button" onClick={() => handleRemoveItem(setRestricoes, restricoes, idx)} className="text-gray-500 hover:text-red-400 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : <span className="text-gray-500 font-mono text-xs italic">Nenhuma restrição adicionada.</span>}
            </div>
          </div>

          <div className="pt-4 border-t border-[#2a2a2a]">
            <button
              type="submit"
              className="w-full py-3 bg-[#e8ff5a] text-[#0d0d0d] font-bold rounded-xl hover:bg-[#d4eb45] transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-[#e8ff5a]/10 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Checklist de Tarefa</span>
            </button>
          </div>
        </form>

        {/* Área de Exibição do Checklist Gerado */}
        <div className="lg:col-span-6 bg-[#1a1a1a] border border-[#2a2a2a] p-8 rounded-2xl space-y-6 shadow-xl flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <Terminal className="w-5 h-5 text-[#e8ff5a]" /> Checklist Gerado
            </h3>

            <button
              type="button"
              onClick={handleCopiar}
              disabled={!checklistGerado}
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
            {checklistGerado ? (
              <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap overflow-y-auto max-h-[600px] select-all leading-relaxed">
                {checklistGerado}
              </pre>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-gray-500 font-mono text-xs select-none">
                <CheckSquare className="w-12 h-12 text-[#2a2a2a] mb-3 animate-pulse" />
                <p>Clique em "Gerar Checklist de Tarefa" no formulário ao lado para compilar a especificação da tarefa.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
