import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useProjetosStore } from '../store/projetos';
import { FolderPlus, FolderKanban, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { ProjetoCard } from '../components/ProjetoCard';
import { NovoProjetoModal } from '../components/NovoProjetoModal';
import { useNavigate } from 'react-router-dom';
import { projetosService } from '../services/projetos';

export const Dashboard: React.FC = () => {
  const { usuario } = useAuthStore();
  const { projetos, projetoAtivo, loading, erro, listar, selecionarProjeto } = useProjetosStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [saudeDashboard, setSaudeDashboard] = useState<any | null>(null);
  const [_carregandoSaude, setCarregandoSaude] = useState(false);

  useEffect(() => {
    listar();
  }, [listar]);

  useEffect(() => {
    const carregarSaudeDashboard = async () => {
      if (projetos.length === 0) return;
      setCarregandoSaude(true);
      try {
        const res = await projetosService.obterSaudeDashboard();
        setSaudeDashboard(res);
      } catch (e) {
        console.error(e);
      } finally {
        setCarregandoSaude(false);
      }
    };
    carregarSaudeDashboard();
  }, [projetos]);

  const handleSelecionar = async (id: string) => {
    await selecionarProjeto(id);
    navigate(`/projetos/${id}`);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-12">
      {/* Banner de Boas-vindas */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-[#2a2a2a]/40 via-[#2a2a2a]/20 to-transparent border border-[#2a2a2a] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-[#e8ff5a]" />
        </div>
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8ff5a]/10 border border-[#e8ff5a]/20 text-[#e8ff5a] text-xs font-mono uppercase tracking-wider">
            <span>Sessão Ativa • Autenticado</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Olá, <span className="text-[#e8ff5a]">{usuario?.nome || 'Desenvolvedor'}</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed font-mono">
            Bem-vindo ao AppControl v2.0. A sua plataforma central para gerenciar o ciclo de desenvolvimento de software com Inteligência Artificial.
          </p>
        </div>
      </div>

      {/* Indicadores de Saúde Globais */}
      {saudeDashboard && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl space-y-3 relative overflow-hidden">
            <div className="text-gray-500 font-bold uppercase tracking-wider">Status Geral de Risco</div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                saudeDashboard.nivel_risco_geral === 'ALTO' ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' :
                saudeDashboard.nivel_risco_geral === 'MÉDIO' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                'bg-green-500/10 text-green-400 border-green-500/20'
              }`}>
                {saudeDashboard.nivel_risco_geral}
              </span>
            </div>
            <p className="text-[10px] text-gray-500">Determinado automaticamente pelos erros e sincronizações</p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl space-y-3">
            <div className="text-gray-400 font-bold uppercase tracking-wider">Média de Confiança</div>
            <div className="text-2xl font-bold text-[#e8ff5a]">{saudeDashboard.score_medio_confianca}%</div>
            <p className="text-[10px] text-gray-500">Média ponderada do score de estabilidade da IA</p>
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl space-y-3">
            <div className="text-gray-400 font-bold uppercase tracking-wider">Erros Ativos Gerais</div>
            <div className="text-2xl font-bold text-red-500">{saudeDashboard.total_erros_ativos}</div>
            <p className="text-[10px] text-gray-500">Total de inconsistências acumuladas no Workspace</p>
          </div>
        </div>
      )}

      {/* Alertas Globais */}
      {saudeDashboard && saudeDashboard.alertas_globais && saudeDashboard.alertas_globais.length > 0 && (
        <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-2xl space-y-3">
          <h4 className="text-sm font-bold text-red-400 font-mono uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> Alertas Críticos de IA (Workspace)
          </h4>
          <div className="space-y-2">
            {saudeDashboard.alertas_globais.map((alertaItem: any, idx: number) => (
              <div key={idx} className="text-xs text-red-300 font-mono flex items-start gap-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-fade-in">
                <span className="font-bold text-red-400 shrink-0">[{alertaItem.projeto_nome}]:</span>
                <span>{alertaItem.alerta}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {erro && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{erro}</span>
        </div>
      )}

      {/* Grid de Projetos */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-[#e8ff5a]" />
            <h3 className="text-lg font-bold text-white tracking-wide">Meus Projetos</h3>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e8ff5a] hover:bg-[#d4eb4b] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#e8ff5a]/10 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Novo Projeto</span>
          </button>
        </div>

        {loading && projetos.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 border border-[#2a2a2a] rounded-2xl bg-[#1a1a1a]/50 gap-4">
            <Loader2 className="w-8 h-8 text-[#e8ff5a] animate-spin" />
            <p className="text-sm text-gray-400 font-mono">Carregando projetos...</p>
          </div>
        ) : projetos.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 border border-[#2a2a2a] rounded-2xl bg-[#1a1a1a]/50 text-center gap-4">
            <FolderKanban className="w-12 h-12 text-gray-600" />
            <div>
              <h4 className="text-lg font-bold text-white">Nenhum projeto encontrado</h4>
              <p className="text-sm text-gray-400 mt-1 font-mono max-w-md mx-auto">
                Você ainda não possui projetos cadastrados. Crie seu primeiro projeto para inicializar o controle de contexto e roadmap.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#e8ff5a] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#d4eb4b] transition-all shadow-lg shadow-[#e8ff5a]/10 mt-2 cursor-pointer"
            >
              Criar Primeiro Projeto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projetos.map((projeto) => (
              <ProjetoCard 
                key={projeto.id} 
                projeto={projeto} 
                isAtivo={projetoAtivo?.id === projeto.id}
                onSelecionar={handleSelecionar}
              />
            ))}
          </div>
        )}
      </div>

      <NovoProjetoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
