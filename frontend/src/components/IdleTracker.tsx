import React, { useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '../store/auth';

// Constante de Fallback (Risco 4 mitigado) - 30 minutos em milissegundos
const FALLBACK_TIMEOUT_MS = 30 * 60 * 1000;
// Teste provisório: Se quiser testar em 1 minuto, use 1 * 60 * 1000;

export const IdleTracker: React.FC = () => {
  const { token, usuario, logout } = useAuthStore();
  
  // Aqui buscaríamos o timeout_inatividade real do banco (futuro)
  // Por enquanto usamos o fallback padrão.
  // const userTimeout = usuario?.timeout_inatividade ? usuario.timeout_inatividade * 60 * 1000 : FALLBACK_TIMEOUT_MS;
  const timeoutLimit = FALLBACK_TIMEOUT_MS; 

  const lastActivityRef = useRef<number>(Date.now());
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Função para deslogar
  const handleTimeout = useCallback(async () => {
    console.warn('Vigia Ativado: Usuário ocioso por muito tempo. Encerrando sessão...');
    
    // Risco 3: Avisa as outras abas que a sessão foi encerrada
    localStorage.setItem('appcontrol-force-logout', Date.now().toString());
    
    await logout();
    window.location.href = '/login';
  }, [logout]);

  // Atualiza o tempo de atividade local e no localStorage (Sincronização de abas)
  const updateActivity = useCallback(() => {
    const now = Date.now();
    
    // Risco 2 mitigado (Throttle): Só atualiza se passou pelo menos 2 segundos do último registro
    if (now - lastActivityRef.current > 2000) {
      lastActivityRef.current = now;
      localStorage.setItem('appcontrol-last-activity', now.toString());
    }
  }, []);

  useEffect(() => {
    // Se não está logado, o Vigia desliga.
    if (!token) return;

    // Inicializa a atividade
    localStorage.setItem('appcontrol-last-activity', Date.now().toString());
    lastActivityRef.current = Date.now();

    // Risco 2: Listeners otimizados
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    
    events.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    // Escuta eventos de outras abas (Risco 3 mitigado)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appcontrol-last-activity' && e.newValue) {
        // Alguém mexeu na Aba A, a Aba B reseta seu relógio interno
        lastActivityRef.current = parseInt(e.newValue, 10);
      }
      if (e.key === 'appcontrol-force-logout') {
        // A Aba A deu timeout, a Aba B se mata também
        window.location.href = '/login';
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // O relógio regressivo do Vigia (checa a cada 10 segundos)
    checkIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      if (timeSinceLastActivity > timeoutLimit) {
        handleTimeout();
      }
    }, 10000);

    // Cleanup (Limpeza) para evitar Zumbis
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateActivity);
      });
      window.removeEventListener('storage', handleStorageChange);
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [token, updateActivity, handleTimeout, timeoutLimit]);

  // O componente é invisível, não renderiza nada na tela
  return null;
};
