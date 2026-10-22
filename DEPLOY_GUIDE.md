# Guia de Configuração, Testes e Publicação — Portal Duas Rodas

Este documento explica a arquitetura do **Portal Duas Rodas**, como testar todas as funcionalidades localmente, como conectar a bancos relacionais (PostgreSQL/MySQL) e como publicar a aplicação em produção sem expor credenciais no frontend.

---

## 1. Arquitetura da Aplicação

O projeto adota uma arquitetura full-stack moderna e desacoplada:

1. **Frontend (React 19 + Tailwind CSS + React Router)**:
   - Roteamento completo via SPA (`/motos`, `/moto/:id`, `/comparar`, `/simulador`, `/anunciar`, `/painel`, `/admin`).
   - Comunicação com a API via endpoints REST (`/api/v1/*`) com cabeçalho `Authorization: Bearer <TOKEN>`.
   - Camada de resiliência com fallback no `src/services/api.ts` para garantir disponibilidade ininterrupta tanto no ambiente de desenvolvimento integrado quanto em deployments estáticos.
   - Nenhuma chave secreta ou hash de senha é exposto ao cliente.

2. **Backend (Express + Node.js em TypeScript)**:
   - Arquivo de entrada: `server.ts`.
   - Autenticação real com senhas criptografadas utilizando `crypto.pbkdf2Sync` (1000 iterações com salt individual criptográfico).
   - Sessões seguras com tokens JWT assinados com `HMAC-SHA256` utilizando segredo definido via variável de ambiente (`JWT_SECRET`).
   - Persistência estruturada em `data/portal_database.json` com gravação atômica, pronta para ser mapeada para PostgreSQL (via Prisma, Drizzle ou pg) em produção.

---

## 2. Credenciais de Teste Demonstrativas

Para testar imediatamente as áreas restritas sem necessidade de novo cadastro:

- **Conta de Administrador (Moderação de Anúncios)**:
  - **E-mail**: `admin@portaldrodas.com.br`
  - **Senha**: `admin123`
  - **Permissões**: Acesso ao `/admin` para destacar motos na Home, pausar, ativar ou remover qualquer anúncio da plataforma.

- **Conta de Vendedor Particular (Gestão de Anúncios)**:
  - **E-mail**: `vendedor@portaldrodas.com.br`
  - **Senha**: `senha123`
  - **Permissões**: Acesso ao `/painel` para gerenciar, editar, marcar como vendida e excluir suas próprias motocicletas.

*Dica: Na tela de login há botões de 1 clique ("Preencher Admin" e "Preencher Vendedor") para facilitar os testes.*

---

## 3. Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passo a passo
1. Clone o repositório ou baixe os arquivos do projeto.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie seu arquivo de variáveis de ambiente com base no `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Adicione a chave secreta para assinatura dos tokens:
   ```env
   JWT_SECRET="sua-chave-secreta-longa-e-aleatoria-2026"
   PORT=3000
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse no navegador: `http://localhost:3000`.

---

## 4. Conectando a um Banco de Dados Relacional em Produção

A camada de dados em `server.ts` utiliza um padrão de repositório isolado. Para migrar para **PostgreSQL**:

1. Adicione o ORM de sua preferência (ex: Drizzle ou Prisma):
   ```bash
   npm install drizzle-orm pg
   npm install -D drizzle-kit @types/pg
   ```
2. Defina o schema correspondente:
   - Tabela `users`: `id`, `name`, `email` (unique), `phone`, `password_hash`, `salt`, `role`, `created_at`.
   - Tabela `motorcycles`: `id`, `title`, `brand`, `model`, `year_model`, `price`, `fipe_price`, `mileage`, `engine_capacity`, `seller_id` (FK -> users.id), `features` (jsonb), `images` (text[]), `status`.
3. Substitua as leituras/escritas em `server.ts` pelas queries do ORM. O frontend continuará consumindo as rotas `/api/v1/*` sem precisar de nenhuma alteração!

---

## 5. Como Publicar o Projeto (Deploy)

### Opção 1: Google Cloud Run ou Docker (Recomendado para Full-Stack)
O projeto já conta com `server.ts` que compila o bundle frontend e serve como backend único:
1. Compile a aplicação:
   ```bash
   npm run build
   ```
2. Execute o servidor de produção:
   ```bash
   npm start
   ```

### Opção 2: Vercel / Netlify + Render
- **Frontend**: Aponte a pasta `dist` como saída do build.
- **Backend**: Suba o `server.ts` no Render, Railway ou Fly.io e configure a URL base da API no frontend.

---

## 6. Funcionalidades Prontas para Teste
- [x] **Home**: Busca rápida combinada por marca, modelo, categoria, faixa de preço e estado.
- [x] **Filtros Avançados**: Página `/motos` com contadores em tempo real, ordenação e filtros multifacetados.
- [x] **Página de Detalhes (PDP)**: Galeria com miniaturas, especificações de potência/torque/consumo, Tabela FIPE e botão WhatsApp gerando conversa personalizada.
- [x] **Comparador**: Adição de até 3 motos lado a lado em `/comparar` com dock flutuante.
- [x] **Simulador de Financiamento**: Cálculo de parcelas CDC com juros, entrada e CET em `/simulador`.
- [x] **Área do Vendedor**: Criar novo anúncio (`/anunciar`), editar fotos e dados (`/editar/:id`), marcar como vendido e excluir (`/painel`).
- [x] **Painel de Moderação**: Painel `/admin` com métricas da plataforma e moderação de anúncios.
