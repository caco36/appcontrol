-- ==========================================
-- DDL SCHEMA — AppControl v1.0 (Supabase)
-- ==========================================

-- 1. Tabela: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    nome TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);

-- 2. Tabela: projetos
CREATE TABLE IF NOT EXISTS projetos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL,
    stack_fe TEXT,
    stack_be TEXT,
    llm_base TEXT,
    arquivos_criticos TEXT[],
    regras_especiais TEXT,
    antigravity_path TEXT,
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW()
);

-- 3. Tabela: fases
CREATE TABLE IF NOT EXISTS fases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    ordem INTEGER NOT NULL,
    percentual INTEGER DEFAULT 0
);

-- 4. Tabela: sessoes
CREATE TABLE IF NOT EXISTS sessoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
    data TIMESTAMP DEFAULT NOW(),
    status TEXT NOT NULL,
    resumo TEXT,
    arquivos_tocados TEXT[],
    arquivos_nao_tocados TEXT[],
    o_que_foi_feito TEXT[],
    o_que_nao_foi_feito TEXT[],
    alertas TEXT[],
    riscos TEXT[],
    proximos_passos TEXT[],
    fonte TEXT DEFAULT 'manual'
);

-- 5. Tabela: erros
CREATE TABLE IF NOT EXISTS erros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projeto_id UUID REFERENCES projetos(id) ON DELETE CASCADE,
    sessao_id UUID REFERENCES sessoes(id) ON DELETE SET NULL,
    tipo TEXT NOT NULL,
    arquivo TEXT,
    descricao TEXT NOT NULL,
    solucao TEXT,
    data TIMESTAMP DEFAULT NOW()
);
