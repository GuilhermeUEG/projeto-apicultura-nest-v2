# 🐝 Sistema de Gestão de Apicultura (Monorepo)

Monorepo estruturado para a disciplina de **PROGRAMAÇÃO WEB I** (UEG — CET), integrando o backend **NestJS 11** (com SQLite, TypeORM e autenticação JWT) e o frontend **Angular 21** (com TailwindCSS, Signals e Componentes Standalone) em um único repositório Git orquestrado por **Turborepo** e **pnpm**.

---

## 👥 Integrantes do Grupo
* **Guilherme Sousa Barbosa**
* **Samuel Antonio Borges Rezende**

## 🍯 Tema do Projeto
**Gestão de Apiários, Colmeias e Colheitas de Mel** (aproveitando e evoluindo toda a lógica de negócio robusta da 1VA).

---

## 🏗️ Estrutura do Monorepo

```text
projeto-apicultura-monorepo/
├── apps/
│   ├── backend/           # NestJS 11 (API RESTful + Autenticação JWT)
│   └── frontend/          # Angular 20 (Interface do Usuário + Design com Tailwind)
├── packages/
│   ├── utils/             # Modelos e validações compartilhados
│   ├── typescript-config/ # Configurações tsconfig compartilhadas
│   └── eslint-config/     # Configurações de Lint compartilhadas
├── .env.example           # Modelo de variáveis de ambiente na raiz
├── package.json           # Dependências de desenvolvimento globais
├── pnpm-workspace.yaml    # Configuração dos workspaces do pnpm
└── turbo.json             # Pipelines de execução do Turborepo
```

---

## 🚀 Como Configurar e Executar

### Pré-requisitos
* **Node.js** (versão 22 ou superior)
* **pnpm** (instalado via `npm install -g pnpm`)

### 1. Instalar as dependências do monorepo
Na raiz do projeto, execute o comando abaixo para instalar todas as dependências do workspace e linkar as configurações internas:
```bash
pnpm install
```

### 2. Configurar Variáveis de Ambiente
Copie o modelo de variáveis de ambiente `.env.example` da raiz para `apps/backend/.env`:
```bash
cp .env.example apps/backend/.env
```
O arquivo `.env` já vem pré-configurado por padrão com os seguintes parâmetros:
```env
PORT=3000
FRONTEND_URL=http://localhost:4200
DATABASE_NAME=apicultura.sqlite
JWT_SECRET=super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
EMAIL_DISABLED=true
```

### 3. Executar o ambiente de desenvolvimento
Para inicializar o backend e o frontend em paralelo, execute:
```bash
pnpm dev
```
Após o build inicial:
* **Frontend Angular** estará disponível em: [http://localhost:4200](http://localhost:4200)
* **Backend NestJS** estará disponível em: [http://localhost:3000](http://localhost:3000)
* **Swagger UI** (documentação dos endpoints) estará disponível em: [http://localhost:3000/swagger-ui](http://localhost:3000/swagger-ui)

---

## 🔐 Credenciais de Acesso (Seed)
Ao iniciar a aplicação pela primeira vez, o banco de dados SQLite é automaticamente populado com o usuário administrador padrão:
* **E-Mail**: `admin@ueg.br`
* **Senha**: `admin123`

---

## 🧹 Limpeza de Dados e de Código

### Reset do Banco de Dados
Para limpar completamente o banco de dados e resetar a aplicação para o estado inicial:
1. Remova o arquivo de banco de dados SQLite `apps/backend/apicultura.sqlite`.
2. Reinicie a aplicação backend (o servidor recriará o arquivo automaticamente no próximo início).
3. O schema do banco de dados será gerado automaticamente e o usuário administrador padrão (`admin@ueg.br` / `admin123`) será recriado pela seed.

### Organização de Comentários (Clean Code)
O projeto segue as diretrizes de *clean code*, removendo comentários desnecessários, obsoletos e redundantes (como anotações óbvias de injeção de dependência ou explicações repetidas de regras de negócios que já são autoexplicativas no código). Foram preservados apenas comentários técnicos que detalham configurações cruciais (como a flag de sincronização no `app.module.ts`), soluções de bugs não óbvias (como o layout block do custom wrapper `<ui-input>`) ou avisos importantes de timezone (como marcas UTC em payload e DTOs).

---

## 📡 Endpoints da API

Abaixo estão listados os principais caminhos expostos pelo backend. Todos os endpoints de controle apícola exigem o cabeçalho `Authorization: Bearer <JWT_TOKEN>`.

### Autenticação (`/auth`)
* `POST /auth/register` — Cadastra um novo usuário (criado como inativo, aguardando aprovação de admin).
* `POST /auth/login` — Efetua o login validando credenciais. Retorna o token JWT (payload com `id`, `email`, `nome` e `role`).
* `POST /auth/forgot-password` — Solicita um link de recuperação de senha por e-mail.
* `POST /auth/reset-password` — Redefine a senha a partir de um token válido.

### Controle de Usuários (Apenas Administradores `/users`)
* `GET /users` — Lista todos os usuários cadastrados.
* `PATCH /users/:id/activate` — Ativa ou desativa a conta do usuário (permitindo/bloqueando login).
* `POST /users/:id/reset-password` — Dispara o e-mail de recuperação de senha para um usuário.

### Apiários (`/apiarios`)
* `GET /apiarios` — Lista todos os apiários.
* `GET /apiarios/:id` — Obtém os detalhes de um apiário.
* `POST /apiarios` — Cria um novo apiário (data no formato `DD/MM/YYYY`, não futura; mínimo de 5 colmeias declaradas).
* `PUT /apiarios/:id` — Atualiza dados do apiário (como marcar operacional/desativado).
* `DELETE /apiarios/:id` — Exclui apiário e colmeias filhas vinculadas.

### Colmeias (`/colmeias`)
* `GET /colmeias/apiario/:apiarioId` — Lista todas as colmeias pertencentes a um apiário.
* `GET /colmeias/:id` — Obtém detalhes de uma colmeia.
* `POST /colmeias/:apiarioId` — Adiciona uma colmeia ao apiário (código único por apiário; bloqueado em apiário desativado).
* `POST /colmeias/:apiarioId/bulk` — Cadastra várias colmeias de uma vez (códigos sequenciais únicos gerados automaticamente).
* `PATCH /colmeias/:id` — Modifica a identificação ou tipo da colmeia.
* `DELETE /colmeias/:id` — Exclui uma colmeia individual.

### Colheitas (`/colheitas`)
* `GET /colheitas` — Lista todas as colheitas registradas (com o apiário relacionado).
* `GET /colheitas/apiario/:apiarioId` — Lista as colheitas de um apiário específico.
* `GET /colheitas/:id` — Obtém os detalhes de uma colheita.
* `POST /colheitas/:apiarioId` — Registra uma nova colheita de mel (valida as regras abaixo).
* `PUT /colheitas/:id` — Edita uma colheita (revalida todas as regras de negócio).
* `DELETE /colheitas/:id` — Exclui uma colheita.

**Regras de negócio validadas no backend:**
* O apiário deve possuir no mínimo **5 colmeias cadastradas** (contagem real de colmeias registradas, não o número declarado).
* É proibido registrar colheita em apiários **desativados**.
* O volume deve ser **maior que zero** e não pode exceder **1,5 litro por colmeia cadastrada**.
* Mel de **alta pureza** exige volume mínimo de **10 litros**; mel comum deve ser inferior a **80% do limite**.
* Data no formato `DD/MM/YYYY`, não pode ser futura e **não pode ser anterior à data de fundação do apiário**.
* Tipos de florada aceitos: *Silvestre, Citros, Eucalipto, Flores Silvestres, Acácia*.

---

## 🛠️ Divisão de Tarefas do Grupo

* **Guilherme Sousa Barbosa**:
  * Configuração inicial da estrutura monorepo (Turborepo + pnpm workspaces).
  * Migração do código do backend 1VA para `apps/backend/`.
  * Criação dos serviços do Angular (`AuthService`, `ApiculturaService`).
  * Implementação da tela de Administração de Usuários (`/admin/users`) e controle de ativação.
  * Configuração do Interceptor HTTP para anexação do token JWT.

* **Samuel Antonio Borges Rezende**:
  * Integração dos módulos de autenticação e proteção por JWT Passport no backend.
  * Customização do filtro global de exceções (`AllExceptionsFilter`) e tratamento de erros do `ValidationPipe`.
  * Desenvolvimento das telas CRUD de Apiários e Colmeias no frontend.
  * Desenvolvimento da tela de Registro de Colheita e exibição de feedback reativo de erro para regras de negócio violadas.
  * Configuração do design responsivo com TailwindCSS.
