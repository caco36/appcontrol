import React from 'react';
import { Projeto } from '../types';
import { FolderKanban, Layers, Calendar, Activity, ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projetosService } from '../services/projetos';
import { downloadMarkdown } from '../utils/nomenclatura';

interface ProjetoCardProps {
  projeto: Projeto;
  isAtivo?: boolean;
  onSelecionar: (id: string) => void;
}

export const ProjetoCard: React.FC<ProjetoCardProps> = ({ projeto, isAtivo, onSelecionar }) => {
  const progresso = projeto.progresso || 0;
  const sessoesCount = projeto.sessoes_count || 0;

  return (
    <div 
      onClick={() => onSelecionar(projeto.id)}
      className={`group relative bg-[#1a1a1a] border p-6 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isAtivo ? 'border-[#e8ff5a] shadow-lg shadow-[#e8ff5a]/10' : 'border-[#2a2a2a] hover:border-[#4a4a4a]'
      }`}
    >
      {isAtivo && (
        <span className="absolute -top-3 right-4 bg-[#e8ff5a] text-[#0d0d0d] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
          <Sparkles className="w-3 h-3" /> Projeto Ativo
        </span>
      )}

      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-[#e8ff5a] transition-colors flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#e8ff5a]" />
            {projeto.nome}
          </h3>
          <p className="text-sm text-gray-400 mt-1 font-mono flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-500" />
            {projeto.tipo}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6 font-mono text-xs text-gray-300">
        <div className="flex items-center justify-between bg-[#0d0d0d] p-2.5 rounded-lg border border-[#2a2a2a]">
          <span className="text-gray-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-blue-400" /> Stack FE:
          </span>
          <span className="text-white font-semibold truncate max-w-[150px]">{projeto.stack_fe || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between bg-[#0d0d0d] p-2.5 rounded-lg border border-[#2a2a2a]">
          <span className="text-gray-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-green-400" /> Stack BE:
          </span>
          <span className="text-white font-semibold truncate max-w-[150px]">{projeto.stack_be || 'N/A'}</span>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
          <span className="text-gray-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-[#e8ff5a]" /> Progresso:
          </span>
          <span className="text-[#e8ff5a] font-bold">{progresso}%</span>
        </div>
        <div className="w-full bg-[#0d0d0d] h-2.5 rounded-full overflow-hidden border border-[#2a2a2a] p-0.5">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-[#e8ff5a] h-full rounded-full transition-all duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]/60 text-xs font-mono">
        <span className="text-gray-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-purple-400" /> {sessoesCount} {sessoesCount === 1 ? 'Sessão' : 'Sessões'}
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              try {
                const res = await projetosService.gerarBriefing(projeto.id);
                downloadMarkdown('briefing', projeto.nome, res.briefing_markdown);
              } catch (err) {
                console.error(err);
              }
            }}
            className="text-[10px] text-gray-400 hover:text-[#e8ff5a] font-sans font-bold border border-[#2a2a2a] px-2.5 py-1.5 rounded-lg bg-[#0d0d0d] hover:bg-[#1a1a1a] transition-all cursor-pointer flex items-center gap-1"
          >
            Briefing
          </button>
          <Link 
            to={`/projetos/${projeto.id}`}
            onClick={(e) => e.stopPropagation()} // Para não disparar o onSelecionar duas vezes
            className="text-[#e8ff5a] hover:underline flex items-center gap-1 font-sans font-semibold"
          >
            Gerenciar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
