
-- =========================================
-- BANCO DE DADOS REConecta
-- =========================================

-- Tabela de doações
CREATE TABLE IF NOT EXISTS doacoes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    localizacao VARCHAR(150) NOT NULL,
    status VARCHAR(30) DEFAULT 'disponivel',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de solicitações
CREATE TABLE IF NOT EXISTS solicitacoes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    localizacao VARCHAR(150) NOT NULL,
    status VARCHAR(30) DEFAULT 'aberta',
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prioridade VARCHAR(20) NOT NULL DEFAULT 'moderada',
    CONSTRAINT solicitacoes_prioridade_check
        CHECK (prioridade IN ('urgente', 'moderada', 'continua'))
);

-- Tabela de administradores
CREATE TABLE IF NOT EXISTS administradores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
