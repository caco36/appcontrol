import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { Dashboard } from './pages/Dashboard';
import { ProjetoDetalhe } from './pages/ProjetoDetalhe';
import { Extrator } from './pages/Extrator';
import { GuardPrompt } from './pages/GuardPrompt';
import { Checklist } from './pages/Checklist';
import { Vistoria } from './pages/Vistoria';
import { Roteiro } from './pages/Roteiro';
import { Historico } from './pages/Historico';
import { Erros } from './pages/Erros';
import { FonteDeVerdade } from './pages/FonteDeVerdade';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  const { carregarSessao } = useAuthStore();

  useEffect(() => {
    carregarSessao();
  }, [carregarSessao]);



  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projetos/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ProjetoDetalhe />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/extrator"
          element={
            <ProtectedRoute>
              <Layout>
                <Extrator />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/guard-prompt"
          element={
            <ProtectedRoute>
              <Layout>
                <GuardPrompt />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checklist"
          element={
            <ProtectedRoute>
              <Layout>
                <Checklist />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vistoria"
          element={
            <ProtectedRoute>
              <Layout>
                <Vistoria />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/roteiro"
          element={
            <ProtectedRoute>
              <Layout>
                <Roteiro />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/historico"
          element={
            <ProtectedRoute>
              <Layout>
                <Historico />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/erros"
          element={
            <ProtectedRoute>
              <Layout>
                <Erros />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/fonte-de-verdade"
          element={
            <ProtectedRoute>
              <Layout>
                <FonteDeVerdade />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
