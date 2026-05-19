import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useProjetosStore } from '../store/projetos';
import { 
  FolderKanban, 
  Cpu, 
  ShieldCheck, 
  CheckSquare, 
  SearchCheck, 
  FileText, 
  History, 
  AlertOctagon, 
  LogOut,
  Zap,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { usuario, logout } = useAuthStore();
  const { projetoAtivo } = useProjetosStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Projetos', icon: FolderKanban },
    { to: '/extrator', label: 'Extrator IA', icon: Cpu },
    { to: '/guard-prompt', label: 'Guard Prompt', icon: ShieldCheck },
    { to: '/checklist', label: 'Checklist', icon: CheckSquare },
    { to: '/vistoria', label: 'Vistoria', icon: SearchCheck },
    { to: '/roteiro', label: 'Roteiro', icon: FileText },
    { to: '/historico', label: 'Histórico', icon: History },
    { to: '/erros', label: 'Log de Erros', icon: AlertOctagon },
    { to: '/fonte-de-verdade', label: 'Fonte de Verdade', icon: Sparkles },
  ];

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-white overflow-hidden font-sans">
      {/* Sidebar Lateral Fixa */}
      <aside className="w-64 bg-[#0d0d0d] border-r border-[#2a2a2a] flex flex-col justify-between shrink-0 z-10">
        {/* Cabeçalho / Logo */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#e8ff5a]/10 border border-[#e8ff5a]/30 flex items-center justify-center text-[#e8ff5a]">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wider text-white flex items-center gap-1.5">
                App<span className="text-[#e8ff5a]">Control</span>
              </h1>
              <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 block">v1.0 • IA Manager</span>
            </div>
          </div>
        </div>

        {/* Projeto Ativo Destaque */}
        <div className="px-4 py-3 bg-[#1a1a1a] border-b border-[#2a2a2a]">
          <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#e8ff5a]" /> Projeto Ativo
          </div>
          {projetoAtivo ? (
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate max-w-[140px]">{projetoAtivo.nome}</span>
              <span className="px-1.5 py-0.5 bg-[#e8ff5a]/10 text-[#e8ff5a] border border-[#e8ff5a]/20 rounded text-[10px] font-mono font-bold">
                {projetoAtivo.progresso || 0}%
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-500 font-mono italic">Nenhum selecionado</span>
          )}
        </div>

        {/* Navegação Principal */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-[#e8ff5a]/10 text-[#e8ff5a] border border-[#e8ff5a]/20 shadow-lg shadow-[#e8ff5a]/5'
                      : 'text-gray-400 hover:bg-[#2a2a2a]/60 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Rodapé / Perfil do Usuário e Logout */}
        <div className="p-4 border-t border-[#2a2a2a] bg-[#2a2a2a]/20">
          <div className="flex items-center justify-between gap-3 px-2 py-1.5">
            <div className="truncate">
              <p className="text-xs font-semibold text-gray-200 truncate">{usuario?.nome || 'Desenvolvedor'}</p>
              <p className="text-[11px] text-gray-500 font-mono truncate">{usuario?.email || 'usuario@appcontrol.ai'}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sair do sistema"
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Área Principal Scrollável */}
      <main className="flex-1 overflow-y-auto bg-[#0d0d0d] p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
