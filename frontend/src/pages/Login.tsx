import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Zap, AlertCircle, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login, loading, erro, limparErro } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Rota de redirecionamento caso o usuário tenha vindo de uma rota protegida
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    limparErro();
    try {
      await login(email, senha);
      navigate(from, { replace: true });
    } catch (err) {
      // O erro já é capturado e setado na store pelo Zustand
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-6 selection:bg-[#e8ff5a] selection:text-black font-sans">
      <div className="w-full max-w-md bg-[#2a2a2a]/20 border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        {/* Logo / Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#e8ff5a]/10 border border-[#e8ff5a]/30 text-[#e8ff5a] mb-2 shadow-lg shadow-[#e8ff5a]/5">
            <Zap className="w-7 h-7 fill-current" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Bem-vindo ao AppControl</h2>
          <p className="text-sm text-gray-400">Gerencie o ciclo de desenvolvimento com IA sem perder o histórico.</p>
        </div>

        {/* Alerta de Erro */}
        {erro && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{erro}</div>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block">E-mail corporativo ou pessoal</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@appcontrol.ai"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#e8ff5a] focus:ring-1 focus:ring-[#e8ff5a] transition-all text-sm font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 block">Senha de acesso</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#e8ff5a] focus:ring-1 focus:ring-[#e8ff5a] transition-all text-sm font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#e8ff5a] hover:bg-[#d4eb4b] text-black font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#e8ff5a]/10 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-wider mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-black" />
                <span>Autenticando...</span>
              </>
            ) : (
              <span>Entrar no Sistema</span>
            )}
          </button>
        </form>

        {/* Link para Cadastro */}
        <div className="mt-8 text-center border-t border-[#2a2a2a] pt-6">
          <p className="text-sm text-gray-400">
            Ainda não possui uma conta?{' '}
            <Link to="/cadastro" className="text-[#e8ff5a] hover:underline font-medium transition-colors">
              Cadastre-se agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
