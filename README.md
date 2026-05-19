# AppControl v1.0 — IA Manager & Context Shield

Plataforma web avançada de gerenciamento do ciclo de desenvolvimento de software impulsionado por Inteligência Artificial. O **AppControl** atua como uma **memória externa**, sistema de proteção e controle de contexto (Guard Prompt), gerenciador de roadmap de execução e registro consolidado de histórico e falhas entre o desenvolvedor e o LLM.

---

## 🚀 Stack Técnica Obrigatória

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS v4 + Zustand + Lucide Icons
- **Backend**: Python 3.11 + FastAPI + Pydantic + Uvicorn
- **Banco de Dados & Autenticação**: Supabase (PostgreSQL + Supabase Auth com RLS e Service Role)
- **Inteligência Artificial**: Google Gemini API (`gemini-2.5-flash`) via `google-generativeai` e suporte legado Anthropic API (`claude-3-5-sonnet`)
- **Deploy de Produção**: Vercel (Frontend SPA) + Railway / Render (Backend REST API)

---

## 📁 Estrutura Modular do Projeto

```text
appcontrol/
├── frontend/                  # Aplicação Single Page Application (React)
│   ├── src/
│   │   ├── components/        # Layout, Sidebar, Navbar e ProtectedRoute
│   │   ├── pages/             # Módulos do Sistema (0 a 10)
│   │   │   ├── Login.tsx / Cadastro.tsx
│   │   │   ├── Dashboard.tsx / ProjetoDetalhe.tsx
│   │   │   ├── Extrator.tsx
│   │   │   ├── GuardPrompt.tsx
│   │   │   ├── Checklist.tsx
│   │   │   ├── Vistoria.tsx
│   │   │   ├── Roteiro.tsx
│   │   │   ├── Historico.tsx
│   │   │   ├── Erros.tsx
│   │   │   └── FonteDeVerdade.tsx
│   │   ├── store/             # Gerenciamento de Estado Global (Zustand)
│   │   ├── services/          # Integração REST (Axios)
│   │   ├── types/             # Definições estritas de TypeScript
│   │   └── main.tsx
│   ├── .env.example
│   └── vite.config.ts
├── backend/                   # API REST de Alta Performance (FastAPI)
│   ├── app/
│   │   ├── routers/           # Endpoints de Auth, Projetos e Extrator IA
│   │   ├── models/            # Schemas Pydantic de Validação
│   │   ├── services/          # Lógica de Negócio (Supabase, Gemini, Auth)
│   │   └── main.py            # Ponto de Entrada da Aplicação
│   ├── .env.example
│   ├── requirements.txt       # Dependências estritas do Python
│   └── schema.sql             # DDL completo das tabelas do Supabase
└── README.md                  # Documentação Mestre
```

---

## 🛠️ Instruções de Execução Local

### 1. Configuração Inicial do Supabase
1. Crie uma conta e um novo projeto no [Supabase](https://supabase.com).
2. No painel do seu projeto, acesse o **SQL Editor** e cole/execute o conteúdo completo do arquivo `backend/schema.sql` para provisionar as tabelas (`usuarios`, `projetos`, `fases`, `sessoes`, `erros`).
3. Em **Project Settings > API**, copie suas credenciais: `Project URL`, `anon public key` e `service_role secret key`.

### 2. Executando o Backend (FastAPI)
Abra um terminal no diretório `backend/`:
```bash
# 1. Crie e ative o ambiente virtual (recomendado)
python -m venv venv

# No Windows:
.\venv\Scripts\activate
# No Linux/Mac:
source venv/bin/activate

# 2. Instale as dependências
pip install -r requirements.txt

# 3. Crie o arquivo .env baseado no exemplo
cp .env.example .env

# Edite o .env preenchendo:
# SUPABASE_URL=sua_url
# SUPABASE_SERVICE_KEY=sua_service_key
# GEMINI_API_KEY=sua_chave_gemini

# 4. Inicie o servidor FastAPI
uvicorn app.main:app --reload --port 8000
```
A API estará rodando em `http://localhost:8000`. A documentação interativa Swagger estará em `http://localhost:8000/docs`.

### 3. Executando o Frontend (React/Vite)
Abra um segundo terminal no diretório `frontend/`:
```bash
# 1. Instale as dependências do Node.js
npm install

# 2. Crie o arquivo .env baseado no exemplo
cp .env.example .env

# Edite o .env preenchendo:
# VITE_SUPABASE_URL=sua_url
# VITE_SUPABASE_ANON_KEY=sua_anon_key
# VITE_API_URL=http://localhost:8000

# 3. Inicie o servidor de desenvolvimento
npm run dev
```
O Frontend estará acessível em `http://localhost:5173`.

---

## 🚀 Guia de Deploy para Produção (Passo a Passo)

### Parte 1: Deploy do Backend (Railway ou Render)

#### Opção A: Railway (Recomendado pela simplicidade)
1. Crie uma conta no [Railway](https://railway.app/) e conecte seu repositório do GitHub.
2. Crie um novo serviço selecionando o repositório do projeto.
3. Em **Settings > Root Directory**, defina o caminho como `/backend`.
4. Em **Variables**, adicione as seguintes variáveis de ambiente:
   - `SUPABASE_URL`: URL do seu projeto Supabase.
   - `SUPABASE_SERVICE_KEY`: Chave de serviço (Service Role) do Supabase.
   - `GEMINI_API_KEY`: Chave de API do Google Gemini.
   - `ENVIRONMENT`: `production`.
   - `CORS_ORIGINS`: `https://sua-url-do-frontend.vercel.app`.
   - `PORT`: `8000` (O Railway mapeia automaticamente a porta fornecida).
5. Em **Settings > Start Command**, garanta que o comando seja:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
6. Clique em **Deploy**. Copie a URL pública gerada (ex: `https://appcontrol-backend.up.railway.app`).

#### Opção B: Render (Alternativa gratuita/popular)
1. No [Render](https://render.com/), crie um novo **Web Service** conectado ao seu repositório.
2. Defina o **Root Directory** como `backend`.
3. Defina o **Build Command** como:
   ```bash
   pip install -r requirements.txt
   ```
4. Defina o **Start Command** como:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
5. Preencha as **Environment Variables** identicamente ao passo do Railway.
6. Realize o deploy e copie a URL pública gerada.

---

### Parte 2: Deploy do Frontend (Vercel)

1. Crie uma conta na [Vercel](https://vercel.com/) e importe seu repositório do GitHub.
2. Na configuração do projeto na Vercel, defina o **Root Directory** como `frontend`.
3. O Vercel detectará automaticamente o framework como **Vite**. Mantenha os comandos padrão:
   - **Build Command**: `npm run build` (que executa `tsc -b && vite build`).
   - **Install Command**: `npm install`.
4. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`: A URL pública do Supabase.
   - `VITE_SUPABASE_ANON_KEY`: A chave pública anônima do Supabase.
   - `VITE_API_URL`: A URL pública do backend gerada no Railway/Render (ex: `https://appcontrol-backend.up.railway.app`).
5. Em **Advanced > Rewrite / Redirects** (ou via arquivo `vercel.json` na pasta `frontend`), certifique-se de configurar o rewrite para suportar o roteamento SPA do React:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
6. Clique em **Deploy**. Sua plataforma estará online e pronta para uso!

---

## 📋 Checklist Final de Verificação (Pré-Produção)

Antes de anunciar o sistema em produção, valide os seguintes 10 itens críticos:

- [ ] **1. Banco de Dados e RLS**: Verifique no painel do Supabase se todas as tabelas foram criadas e se o Row Level Security (RLS) está ativo para proteger os dados de cada usuário.
- [ ] **2. Variáveis de Ambiente do Backend**: Confirme que o backend no Railway/Render possui as chaves `SUPABASE_SERVICE_KEY` e `GEMINI_API_KEY` válidas e ativas.
- [ ] **3. CORS do Backend**: Garanta que a variável `CORS_ORIGINS` no backend inclui o domínio exato de produção gerado pela Vercel (ex: `https://meu-appcontrol.vercel.app`).
- [ ] **4. Variáveis de Ambiente do Frontend**: Verifique se a Vercel possui o `VITE_API_URL` apontando para o backend de produção (sem barra no final `/`).
- [ ] **5. Build Limpo**: Confirme que o comando `npm run build` executa sem erros de TypeScript ou linting.
- [ ] **6. Fluxo de Autenticação**: Realize um teste fim a fim de Cadastro, Login e Logout na URL de produção da Vercel.
- [ ] **7. Persistência de Projetos**: Crie um novo projeto no Dashboard e confirme que as 6 fases padrão do roadmap são geradas no banco de dados.
- [ ] **8. Conexão com IA (Gemini)**: Acesse o módulo **Extrator IA**, cole uma resposta de teste e verifique se a análise é concluída e renderizada corretamente em cards.
- [ ] **9. Proteção de Rotas SPA**: Tente acessar `/roteiro` ou `/erros` sem estar logado e verifique se o sistema redireciona corretamente para `/login`.
- [ ] **10. Exportação e Download**: Acesse o módulo **Fonte de Verdade** e verifique se o download do arquivo `.md` ocorre nativamente pelo navegador.

---

## 🛡️ Troubleshooting & Solução de Problemas

### 1. Erro `500 Internal Server Error` no Extrator IA
- **Causa provável**: A chave `GEMINI_API_KEY` no backend está ausente, inválida ou sem quota disponível.
- **Solução**: Verifique os logs do console no Railway/Render e certifique-se de ter uma chave de API válida configurada nas variáveis de ambiente.

### 2. Erro `CORS Policy Blocked` no Frontend
- **Causa provável**: O domínio da Vercel não foi cadastrado no middleware de CORS do FastAPI.
- **Solução**: Acesse as configurações de variáveis no Railway/Render, adicione a URL da Vercel à variável `CORS_ORIGINS` (separada por vírgula se houver mais de uma) e reinicie o serviço.

### 3. Erro `404 Not Found` ao recarregar página na Vercel
- **Causa provável**: O servidor Vercel está tentando buscar um arquivo físico para a rota (ex: `/roteiro`) em vez de servir o `index.html`.
- **Solução**: Certifique-se de ter o arquivo `vercel.json` na raiz da pasta `frontend` com a regra de rewrite para `/index.html`.

---

## 📜 Licença e Autoria
AppControl v1.0 — Desenvolvido sob especificações de ponta para gerenciamento autônomo e assistido de engenharia de software com IA.
