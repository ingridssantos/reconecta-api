# ReConecta API

API REST desenvolvida para o projeto **ReConecta**, com o objetivo de conectar pessoas que desejam realizar doações a pessoas que precisam de ajuda, incentivando a solidariedade e contribuindo para a redução das desigualdades sociais.

O projeto está alinhado ao **ODS 10 — Redução das Desigualdades**, da Organização das Nações Unidas (ONU).

## Objetivo

Facilitar a divulgação e a busca por doações, criando uma conexão entre doadores e pessoas que possuem necessidades específicas.

## Funcionalidades

- Cadastro de doações.
- Listagem de doações.
- Atualização de doações.
- Exclusão de doações.
- Cadastro de solicitações.
- Listagem de solicitações.
- Atualização de solicitações.
- Exclusão de solicitações.
- Validação de dados enviados.
- Tratamento de erros e respostas HTTP.
- Documentação interativa com Swagger.

## Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- JavaScript
- Swagger (OpenAPI)
- Git e GitHub

## Estrutura do projeto

```text
reconecta-api/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── docs/
│   │   └── swagger.js
│   ├── routes/
│   │   ├── doacoes.js
│   │   └── solicitacoes.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

## Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- PostgreSQL instalado e em execução.
- Git instalado.

### 1. Clonar o repositório

```bash
git clone https://github.com/ingridssantos/reconecta-api.git
```

### 2. Acessar a pasta

```bash
cd reconecta-api
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reconecta
DB_USER=postgres
DB_PASSWORD=sua_senha
PORT=3000
```

Substitua `sua_senha` pela senha configurada no seu PostgreSQL.

Crie também as tabelas `doacoes` e `solicitacoes` no banco de dados `reconecta`.

### 5. Iniciar o servidor

```bash
npm start
```

O servidor será iniciado em:

`http://localhost:3000`

## Documentação da API

Com o servidor em execução, acesse a documentação interativa do Swagger:

`http://localhost:3000/api-docs`

## Rotas principais

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/status` | Verificar o funcionamento da API |
| GET | `/api/doacoes` | Listar doações |
| POST | `/api/doacoes` | Cadastrar doação |
| PUT | `/api/doacoes/:id` | Atualizar doação |
| DELETE | `/api/doacoes/:id` | Excluir doação |
| GET | `/api/solicitacoes` | Listar solicitações |
| POST | `/api/solicitacoes` | Cadastrar solicitação |
| PUT | `/api/solicitacoes/:id` | Atualizar solicitação |
| DELETE | `/api/solicitacoes/:id` | Excluir solicitação |

## Impacto social

O ReConecta busca utilizar a tecnologia como ferramenta de transformação social, facilitando o acesso a recursos e incentivando a colaboração entre pessoas e comunidades.

## Status do projeto

Em desenvolvimento.

---

Desenvolvido como projeto acadêmico.
