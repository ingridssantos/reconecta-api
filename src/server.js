
require('dotenv').config();

const express = require('express');
const app = express();

const doacoesRoutes = require('./routes/doacoes');
const solicitacoesRoutes = require('./routes/solicitacoes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// Configurações gerais
app.use(express.json());

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
app.use('/api/doacoes', doacoesRoutes);
app.use('/api/solicitacoes', solicitacoesRoutes);

// Verificar se a API está funcionando
app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: 'online',
        mensagem: 'API do ReConecta funcionando!',
        versao: '1.0.0'
    });
});

// Rota inicial da API
app.get('/', (req, res) => {
    res.status(200).json({
        mensagem: 'Bem-vindo à API do ReConecta!',
        projeto: 'ReConecta',
        objetivo: 'Conectar pessoas através da doação e solidariedade.'
    });
});

// Tratar erros da aplicação
app.use((erro, req, res, next) => {
    console.error('Erro inesperado:', erro.message);

    if (erro instanceof SyntaxError && erro.status === 400 && 'body' in erro) {
        return res.status(400).json({
            erro: 'O JSON enviado é inválido.'
        });
    }

    res.status(500).json({
        erro: 'Ocorreu um erro interno no servidor.'
    });
});

// Tratar rotas inexistentes
app.use((req, res) => {
    res.status(404).json({
        erro: 'Rota não encontrada.'
    });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ReConecta rodando na porta ${PORT}`);
});
