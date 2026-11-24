
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'ReConecta API',
            version: '1.0.0',
            description: `
API REST do projeto ReConecta.

O ReConecta tem como objetivo conectar pessoas que desejam doar
a pessoas que precisam de doações, incentivando a solidariedade
e contribuindo para a redução das desigualdades sociais.

### Funcionalidades disponíveis

- Cadastro, consulta, atualização e exclusão de doações.
- Cadastro, consulta, atualização e exclusão de solicitações.
- Autenticação de administradores.

As requisições e respostas utilizam o formato JSON.
            `
        },

        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Ambiente de desenvolvimento local'
            }
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Informe o token JWT recebido no login.'
                }
            }
        },

        tags: [
            {
                name: 'Doações',
                description: 'Operações relacionadas às doações disponíveis.'
            },
            {
                name: 'Solicitações',
                description: 'Operações relacionadas às necessidades de doação.'
            },
            {
                name: 'Autenticação',
                description: 'Operações de acesso dos administradores.'
            }
        ]
    },

    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
