# Portal Duas Rodas - Marketplace Completo de Motos

Plataforma completa de compra, venda e comparação de motocicletas inspirada nos maiores portais automotivos do Brasil (Webmotors, iCarros e Moto.com.br), desenvolvida em React com Tailwind CSS, backend Express com autenticação real via JWT, banco de dados local com persistência de anúncios e ferramentas integradas para compradores e vendedores.

## Decisões Críticas e Preferências Confirmadas

> [!IMPORTANT]
> As preferências fundamentais de identidade, arquitetura e escopo funcional foram confirmadas na fase de alinhamento e guiarão toda a construção.

- **Identidade e Estilo**: *Portal Duas Rodas* — Fundo claro, superfícies neutras limpas e acentos em vermelho dinâmico (#E11D48 / #DC2626), tipografia geométrica de alta legibilidade (*Plus Jakarta Sans* / *Outfit*), cards com fotos destacadas e dados tabulares limpos sem poluição visual.
- **Arquitetura Full-Stack**: Servidor Express em TypeScript com rotas de API `/api/v1/*`, autenticação JWT segura com senhas criptografadas (PBKDF2/SHA256 salt), persistência em repositório estruturado JSON/SQLite local, e desacoplamento para fácil migração para PostgreSQL/MySQL em produção.
- **Ferramentas Inclusas**: Busca avançada multifacetada, simulador de financiamento automotivo (CDC com taxas de mercado e cálculo de parcelas), comparador lado a lado de motocicletas, botão direto de contato via WhatsApp com mensagem pré-formatada, painel do vendedor (criar, editar, pausar e excluir anúncios) e painel administrativo de moderação.

---

## 1. Visão Geral e Conceito Central

- **O que faz**: Oferece uma experiência fluida para motociclistas buscarem motos novas e seminovas com filtros refinados (marca, modelo, ano, faixa de preço, cilindrada, tipo/categoria e estado/cidade brasileiro), simularem financiamento em tempo real, compararem fichas técnicas e entrarem em contato direto com vendedores pelo WhatsApp. Vendedores contam com área autenticada para gerenciar anúncios com upload/links de fotos, dados técnicos e valores.
- **Público-Alvo**: Compradores de motos urbanas, scooters, esportivas, big trail e custom no Brasil, além de vendedores particulares e revendedores que buscam um portal ágil, confiável e profissional.
- **Valor Principal**: Transparência nas informações (quilometragem, estado, IPVA pago, único dono), simulação financeira imediata e comunicação sem atrito via WhatsApp sem intermediários burocráticos.

---

## 2. Experiência do Usuário e Design Visual

### Fluxos Principais do Usuário
1. **Home & Descoberta**: Banner de busca rápida por Marca, Modelo e Faixa de Preço, atalhos por categoria visual (Scooter, Trail, Street, Custom, Esportiva, Touring), vitrine de motos em destaque e simulador de parcelas.
2. **Resultados e Filtros**: Barra lateral expansível com filtros multifacetados em tempo real (marca, faixa de ano com slider, faixa de preço, cilindrada em faixas como até 160cc, 250-400cc, 500-800cc, 1000cc+, localização por UF/Cidade), ordenação por menor preço, maior preço, mais recente ou menor quilometragem.
3. **Página de Detalhes da Moto (PDP)**: Galeria com visualizador ampliado, ficha técnica completa (cilindrada, tipo de motor, combustível, freios ABS, partida elétrica, ano modelo/fabricação), dados do vendedor com selo de verificação, simulador de financiamento contextual e botão destacado de WhatsApp gerando link `https://wa.me/...` com texto customizado contendo o modelo e código do anúncio.
4. **Comparador Duas Rodas**: Permite fixar até 3 motocicletas para comparação técnica detalhada lado a lado (potência, consumo médio, cilindrada, peso, freios e custo-benefício).
5. **Autenticação & Gestão do Vendedor**: Cadastro e Login seguros com validação em tempo real de e-mail, telefone e senha; Dashboard "Meus Anúncios" para criar, editar informações/fotos, alterar preço e excluir motos.
6. **Painel de Moderação Administrativa**: Visualização de anúncios pendentes ou ativos, aprovação/rejeição e estatísticas gerais da plataforma.

### Identidade Visual e Estilo
- **Paleta de Cores**:
  - *Dominante (60%)*: Branco puro (`#FFFFFF`) e cinza suave neutro (`#F8FAFC` / `#F1F5F9`) para descanso visual e máxima nitidez de fotos.
  - *Estrutural (30%)*: Cinza escuro ardósia (`#0F172A` e `#334155`) para tipografia, cabeçalhos e divisores sutis em hairline (`border-slate-200`).
  - *Acento (10%)*: Vermelho dinâmico portal (`#DC2626` / `#E11D48`) em botões de ação primária (Buscar, Simular, Anunciar, Falar no WhatsApp).
- **Tipografia**: *Plus Jakarta Sans* e *Outfit* para títulos e valores numéricos em `tabular-nums` alinhados para preços (`R$ 42.900`) e quilometragens.
- **Top Bar Contract**: Logotipo "Portal Duas Rodas" com ícone estilizado de moto, 4 links diretos limpos (*Comprar*, *Vender*, *Comparador*, *Simulador*), indicador de usuário/login e botão de ação primária `Anunciar Moto`.

---

## 3. Decisões Técnicas e Compensações

- **Decisão 1: Servidor Full-Stack Integrado (Express + Vite)**
  - *Abordagem*: Inicialização conjunta ou proxy de desenvolvimento com `server.ts` servindo rotas `/api/*` e o Vite servindo a SPA. Para produção, compilação via `npm run build` e execução pelo Node.js.
  - *Por quê*: Permite autenticação real (hash com salt PBKDF2, tokens JWT sem vazar segredos) e persistência de dados real, mantendo compatibilidade total com o ambiente de execução.
- **Decisão 2: Armazenamento e Inicialização com Dados Demonstrativos Ricos**
  - *Abordagem*: Repositório de dados persistido em arquivo local (`data/database.json` com schema tipado) carregado na memória com atomic writes e seed automático de mais de 12 modelos reais do mercado brasileiro (Honda CB 500X, Yamaha MT-07, BMW R 1250 GS, Royal Enfield Hunter 350, Kawasaki Ninja 400, Honda Biz 125, etc.).
  - *Por quê*: Proporciona persistência imediata entre reinicializações sem dependência de containers externos no primeiro momento, permitindo ao usuário testar busca, filtros, criação de anúncios e edição de imediato.
- **Decisão 3: Roteamento com React Router v7 / SPA Router**
  - *Abordagem*: Rotas declarativas (`/`, `/motos`, `/moto/:id`, `/comparar`, `/simulador`, `/anunciar`, `/painel`, `/admin`, `/login`, `/cadastro`) com controle de navegação e histórico limpo.

---

## 4. Arquitetura Técnica e Estratégia de Dados

### Diagrama de Arquitetura do Sistema

```
┌────────────────────────────────────────────────────────────────────────┐
│                          NAVEGADOR (CLIENTE REACT)                     │
│                                                                        │
│  ┌───────────────────────┐  ┌────────────────────────────────────────┐ │
│  │   Top Bar & Header    │  │   React Router (Rotas da Aplicação)    │ │
│  └───────────────────────┘  └────────────────────────────────────────┘ │
│                                                                        │
│  ┌───────────────┐ ┌────────────────┐ ┌────────────────┐ ┌───────────┐ │
│  │  Home / Busca │ │ Resultados &   │ │ Detalhes da    │ │ Painel do │ │
│  │  Rápida       │ │ Filtros        │ │ Moto & Galeria │ │ Vendedor  │ │
│  └───────────────┘ └────────────────┘ └────────────────┘ └───────────┘ │
│  ┌───────────────┐ ┌────────────────┐ ┌────────────────┐ ┌───────────┐ │
│  │ Comparador    │ │ Simulador de   │ │ Moderação      │ │ Auth      │ │
│  │ Técnico       │ │ Financiamento  │ │ Admin          │ │ Context   │ │
│  └───────────────┘ └────────────────┘ └────────────────┘ └───────────┘ │
│                                 │ (Chamadas REST com fetch / Bearer)   │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND EXPRESS (NODE.JS)                       │
│                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │  Middleware de Auth JWT │  │  Validador de Schemas e Payloads    │  │
│  └─────────────────────────┘  └─────────────────────────────────────┘  │
│                                                                        │
│  ┌────────────────────┐ ┌───────────────────┐ ┌─────────────────────┐  │
│  │ /api/v1/auth       │ │ /api/v1/motorcycles│ │ /api/v1/user/ads    │  │
│  │ (login/signup/me)  │ │ (search/list/id)  │ │ (create/edit/delete)│  │
│  └────────────────────┘ └───────────────────┘ └─────────────────────┘  │
│                                 │                                      │
│                                 ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │   Camada de Repositório & Persistência Local (Seed Automático)   │  │
│  │   - Usuários (com hash PBKDF2/SHA256)                            │  │
│  │   - Anúncios de Motos (status, fotos, especificações, vendedor)  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Entidades de Dados Principais

1. **User**: `id`, `name`, `email`, `passwordHash`, `phone` (com WhatsApp), `role` (`'user' | 'admin'`), `createdAt`.
2. **MotorcycleAd**:
   - `id`, `title`, `brand` (ex: Honda, Yamaha, BMW, Kawasaki, Triumph, Royal Enfield), `model`, `version`, `yearManufacture`, `yearModel`.
   - `price` (R$), `fipePrice` (R$ referência de mercado), `mileage` (km).
   - `engineCapacity` (cc), `fuelType` (Gasolina, Flex), `color`, `category` (Street, Trail, Custom, Scooter, Esportiva, Touring).
   - `state` (UF), `city`, `images` (array de URLs de alta resolução com fallbacks).
   - `description`, `features` (partida elétrica, freio ABS, painel digital, slider, baú, único dono, IPVA pago).
   - `sellerId`, `sellerName`, `sellerPhone`, `sellerType` ('particular' | 'concessionaria').
   - `status` ('active' | 'pending' | 'sold'), `createdAt`.
3. **ComparisonItem**: seleção de IDs de motos para comparação e cálculo de diferenças de especificações.
4. **FinancingSimulation**: valor de entrada, prazo (12x, 24x, 36x, 48x), taxa de juros estimada mensal e cálculo da parcela mensal e CET (Custo Efetivo Total).

---

## 5. Fases de Execução

1. **Instalação e Infraestrutura de Rotas e Tipagem**:
   - Adicionar dependências essenciais (`react-router-dom`).
   - Configurar scripts no `package.json` para executar o servidor Express unificado com Vite ou proxy de desenvolvimento.
   - Definir tipagens completas (`src/types/motorcycle.ts`, `src/types/auth.ts`).
2. **Servidor Express e API REST**:
   - Implementar `server.ts` com endpoints de autenticação (`/api/v1/auth`), busca com filtros compostos (`/api/v1/motorcycles`), gerenciamento de anúncios do usuário e moderação admin.
   - Criar banco de dados demonstrativo persistente com 12+ motos detalhadas do mercado brasileiro com fotos de alta qualidade e fichas técnicas completas.
3. **Página Inicial (Home)**:
   - Header seguindo o Top Bar Contract.
   - Hero com motor de busca rápida (Marca, Modelo, Ano, Preço Máximo).
   - Carrossel/grid de categorias de motocicletas.
   - Vitrine de motos em destaque com cards profissionais (preço em destaque, ano/km, cidade/UF e selos informativos limpos).
   - Ferramenta rápida de simulação de financiamento.
4. **Página de Catálogo e Filtros Avançados**:
   - Filtros dinâmicos com contadores (Marca, Faixa de Preço, Ano, Cilindrada, Tipo de Moto, Estado/Região).
   - Ordenação (menor valor, maior valor, ano mais novo, menor km).
   - Layout responsivo com drawer de filtros para celulares.
5. **Página de Detalhes da Motocicleta (PDP)**:
   - Galeria com seleção de foto principal e miniaturas.
   - Bloco de compra contíguo com preço, comparação com a Tabela FIPE e botão WhatsApp com mensagem personalizada.
   - Ficha técnica detalhada e lista de opcionais.
   - Calculadora de financiamento integrada no anúncio.
6. **Comparador de Motos e Simulador Independente**:
   - Tela para comparar até 3 motos lado a lado destacando diferenças técnicas.
   - Calculadora de financiamento detalhada com gráficos de amortização simples.
7. **Autenticação, Anúncio de Moto e Área do Vendedor**:
   - Telas de Login e Cadastro com validação de formulário.
   - Formulário completo para anunciar moto (dados técnicos, fotos, preço, opcionais).
   - Painel "Meus Anúncios" com opções de editar, marcar como vendida e excluir.
8. **Painel de Moderação Administrativa e Verificação**:
   - Painel para administradores moderarem anúncios.
   - Guia de publicação e configuração (`README.md` explicativo para deploy e banco de dados).
   - Testes e compilação limpa com `compile_applet`.
