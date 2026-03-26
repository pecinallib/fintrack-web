# 💰 FinTrack Web

Dashboard de finanças pessoais — visualize e gerencie suas receitas e despesas.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Sobre

Frontend do FinTrack — uma aplicação completa para controle de finanças pessoais. Inclui autenticação, dashboard com gráficos interativos, CRUD de transações e categorias, e suporte a Dark/Light mode. Construída com React moderno, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

- **Biblioteca:** React 19
- **Linguagem:** TypeScript 5.9
- **Build tool:** Vite 8
- **Estilização:** Tailwind CSS 4
- **Gráficos:** Recharts
- **Animações:** Framer Motion
- **Roteamento:** React Router 7
- **HTTP Client:** Axios

## ✨ Funcionalidades

- **Autenticação** — Login e cadastro com persistência de sessão
- **Dashboard** — Cards de resumo, gráfico de barras (receitas vs despesas) e gráfico de pizza (despesas por categoria)
- **Transações** — CRUD completo com modal de criação/edição, valores em BRL e filtro por categoria
- **Categorias** — CRUD completo para organizar transações
- **Dark/Light Mode** — Alternância de tema com persistência no localStorage
- **Animações** — Transições de página, animações nos cards e modais com Framer Motion
- **Rotas protegidas** — Redirecionamento automático para login quando não autenticado
- **Responsivo** — Layout adaptado para desktop e mobile

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   ├── AnimatedCard.tsx
│   ├── CategoryModal.tsx
│   ├── Layout.tsx
│   ├── PageHead.tsx
│   ├── PageTransition.tsx
│   ├── ThemeToggle.tsx
│   └── TransactionModal.tsx
├── contexts/          # Contexts do React
│   ├── AuthContext.tsx
│   ├── AuthContextDef.ts
│   └── ThemeContext.tsx
├── hooks/             # Hooks customizados
│   ├── useAuth.ts
│   └── useTheme.ts
├── pages/             # Páginas da aplicação
│   ├── Categories.tsx
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Transactions.tsx
├── services/          # Comunicação com a API
│   ├── api.ts
│   ├── categories.ts
│   ├── summary.ts
│   └── transactions.ts
├── types/             # Tipagens TypeScript
│   ├── auth.ts
│   └── transaction.ts
├── utils/             # Utilitários
│   └── getErrorMessage.ts
├── App.tsx            # Rotas e providers
├── index.css          # Tailwind + estilos globais
└── main.tsx           # Ponto de entrada
```

## ⚙️ Como rodar

### Pré-requisitos

- Node.js 22+
- [FinTrack API](https://github.com/pecinallib/fintrack-api) rodando na porta 3000

### Instalação

```bash
# Clone o repositório
git clone https://github.com/pecinallib/fintrack-web.git
cd fintrack-web

# Instale as dependências
npm install
```

### Executando

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

A aplicação inicia em `http://localhost:5173`.

### Uso

1. Acesse `http://localhost:5173`
2. Cadastre uma conta em "Cadastre-se"
3. Crie categorias em "Categorias" (ex: Alimentação, Transporte, Moradia)
4. Adicione transações em "Transações" com receitas e despesas
5. Visualize o resumo no "Dashboard"

## 🔗 Backend

A API do FinTrack está disponível em: [fintrack-api](https://github.com/pecinallib/fintrack-api)

## 📝 Padrões do projeto

- **Conventional Commits** — `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
- **Git Flow** — Branches `main`, `dev` e `feat/*`
- **Pull Requests** — Toda feature mergeada via PR com descrição
- **TypeScript strict** — Tipagem completa em toda a aplicação

## 👤 Autor

**Matheus Bastos Pecinalli**

- GitHub: [@pecinallib](https://github.com/pecinallib)
- LinkedIn: [/in/dev-pecinalli](https://www.linkedin.com/in/dev-pecinalli)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
