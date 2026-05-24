import React, { useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '../store/auth';

// TESTE RADICAL: Timeout de apenas 10 segundos
const FALLBACK_TIMEOUT_MS = 10 * 1000;

export const IdleTracker: React.FC = () => {
  const { token, usuario, logout } = useAuthStore();
  
  // Aqui buscaríamos o timeout_inatividade real do banco (futuro)
  const timeoutLimit = FALLBACK_TIMEOUT_MS; 

  const lastActivityRef = useRef<number>(Date.now());
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Função para deslogar
  const handleTimeout = useCallback(async () => {
    console.warn('Vigia Ativado: Usuário ocioso por 10 segundos. Encerrando sessão...');
    
    // Risco 3: Avisa as outras abas que a sessão foi encerrada
    localStorage.setItem('appcontrol-force-logout', Date.now().toString());
    
    await logout();
    window.location.href = '/login';
  }, [logout]);

  // Atualiza o tempo de atividade local e no localStorage
  const updateActivity = useCallback(() => {
    const now = Date.now();
    
    // Risco 2 mitigado (Throttle): Só atualiza se passou pelo menos 2 segundos
    if (now - lastActivityRef.current > 2000) {
      lastActivityRef.current = now;
      localStorage.setItem('appcontrol-last-activity', now.toString());
    }
  }, []);

  useEffect(() => {
    // Se não está logado, o Vigia desliga.
    if (!token) return;

    localStorage.setItem('appcontrol-last-activity', Date.now().toString());
    lastActivityRef.current = Date.now();

    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    
    events.forEach((event) => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appcontrol-last-activity' && e.newValue) {
        lastActivityRef.current = parseInt(e.newValue, 10);
      }
      if (e.key === 'appcontrol-force-logout') {
        window.location.href = '/login';
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // O relógio regressivo do Vigia para o teste: checa a cada 2 segundos
    checkIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      if (timeSinceLastActivity > timeoutLimit) {
        handleTimeout();
      }
    }, 2000);

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
