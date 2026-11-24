# ReConecta

**Doe. Conecte. Transforme.**

O ReConecta é uma aplicação web desenvolvida para conectar pessoas que desejam realizar doações a pessoas que precisam de ajuda, incentivando a solidariedade e contribuindo para a redução das desigualdades sociais.

O projeto está alinhado ao **ODS 10 — Redução das Desigualdades**, estabelecido pela Organização das Nações Unidas (ONU).

## Objetivo

Facilitar a divulgação e a busca por doações, criando uma conexão entre doadores e pessoas que possuem necessidades específicas.

## Funcionalidades

### Para os usuários
- Cadastro de doações.
- Visualização das doações disponíveis.
- Cadastro de solicitações.
- Visualização das solicitações publicadas.
- Organização das solicitações por prioridade.

### Administração
- Login administrativo.
- Autenticação utilizando JWT.
- Cadastro, edição e exclusão de doações.
- Cadastro, edição e exclusão de solicitações.
- Proteção das operações administrativas.
- Criptografia de senhas com bcrypt.

### API
- Validação dos dados recebidos.
- Tratamento de erros e respostas HTTP.
- Integração com banco de dados PostgreSQL.
- Documentação interativa com Swagger.

## Tecnologias utilizadas

**Backend**
- Node.js
- Express
- JavaScript
- PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs

**Frontend**
- HTML5
- CSS3
- JavaScript

**Documentação e ferramentas**
- Swagger / OpenAPI
- Git
- GitHub

## Estrutura do projeto

```text
reconecta-api/
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── src/
│   ├── config/
│   │   └── database.js
│   ├── docs/
│   │   └── swagger.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── doacoes.js
│   │   └── solicitacoes.js
│   ├── scripts/
│   │   └── criarAdmin.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- PostgreSQL instalado e em execução.
- Git instalado.
- Navegador atualizado.

### 1. Clonar o repositório

```bash
git clone https://github.com/ingridssantos/reconecta-api.git
```

### 2. Acessar a pasta do projeto

```bash
cd reconecta-api
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar o banco de dados

Crie um banco de dados PostgreSQL chamado:

```sql
CREATE DATABASE reconecta;
```

Crie as tabelas necessárias para armazenar:
- Doações.
- Solicitações.
- Administradores.

As tabelas devem seguir os campos e tipos utilizados pelas consultas da aplicação.

### 5. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando como referência o `.env.example`.

Configure as seguintes variáveis:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reconecta
DB_USER=postgres
DB_PASSWORD=sua_senha
PORT=3000
JWT_SECRET=sua_chave_secreta
```

Substitua os valores de acordo com sua configuração local.

**Importante:** não compartilhe o arquivo `.env` nem publique senhas ou chaves secretas no GitHub.

### 6. Iniciar a API

```bash
npm start
```

Para executar em modo de desenvolvimento:

```bash
npm run dev
```

A API estará disponível em:

http://localhost:3000

### 7. Criar um administrador

Com o banco de dados configurado, execute:

```bash
node src/scripts/criarAdmin.js
```

Informe nome, e-mail e senha quando solicitado.

A senha será armazenada de forma criptografada no banco de dados.

### 8. Executar o frontend

Com a API em execução, abra o arquivo `frontend/index.html` utilizando uma extensão como Live Server no Visual Studio Code.

O frontend deverá se comunicar com a API disponível em `http://localhost:3000`.

## Documentação da API

A documentação interativa foi desenvolvida com Swagger.

Com o servidor em execução, acesse:

http://localhost:3000/api-docs

## Principais endpoints

| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| GET | `/api/status` | Verificar funcionamento da API | Público |
| GET | `/api/doacoes` | Listar doações | Público |
| POST | `/api/doacoes` | Cadastrar doação | Público |
| PUT | `/api/doacoes/:id` | Atualizar doação | Administrador |
| DELETE | `/api/doacoes/:id` | Excluir doação | Administrador |
| GET | `/api/solicitacoes` | Listar solicitações | Público |
| POST | `/api/solicitacoes` | Cadastrar solicitação | Público |
| PUT | `/api/solicitacoes/:id` | Atualizar solicitação | Administrador |
| DELETE | `/api/solicitacoes/:id` | Excluir solicitação | Administrador |

As operações administrativas exigem autenticação por token JWT.

## Impacto social

O ReConecta busca utilizar a tecnologia como ferramenta de transformação social, facilitando o acesso a recursos, incentivando a colaboração e aproximando pessoas que desejam ajudar daquelas que precisam de apoio.

A iniciativa contribui para a reflexão sobre o papel da tecnologia na construção de uma sociedade mais justa e inclusiva.

## Status do projeto

**Desenvolvido como projeto acadêmico.**

Aplicação com frontend integrado à API, persistência em banco de dados e autenticação administrativa.

---

Desenvolvido com 💚 para conectar pessoas e transformar realidades.