# 💰 FinTrack Web

Dashboard de finanças pessoais — visualize e gerencie suas receitas e despesas.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Sobre

Frontend do FinTrack — uma aplicação completa para controle de finanças pessoais. Inclui autenticação, dashboard com gráficos interativos e filtro por período, CRUD de transações com filtros avançados, CRUD de categorias, histórico de ações, e suporte a Dark/Light mode. Construída com React moderno, TypeScript e Tailwind CSS.

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
- **Dashboard** — Cards de resumo, gráfico de barras (receitas vs despesas), gráfico de pizza (despesas por categoria) e filtro por período
- **Transações** — CRUD completo com modal, valores em BRL e filtros avançados (pesquisa por título, tipo, categoria e período)
- **Categorias** — CRUD completo com verificação de duplicidade case-insensitive
- **Histórico** — Últimas 20 ações com badges coloridos por tipo (criar, editar, deletar) e detalhes descritivos
- **Dark/Light Mode** — Alternância de tema com persistência no localStorage
- **Recuperação de Senha** — Fluxo completo de "Esqueceu a senha?" com envio de email e redefinição via token
- **Calculadora** — Calculadora de juros simples e compostos integrada
- **Animações** — Transições de página, animações nos cards e modais com Framer Motion
- **Rotas protegidas** — Redirecionamento automático para login quando não autenticado
- **Responsivo** — Menu hambúrguer com painel lateral abaixo de 768px
- **UX** — Modais fecham ao clicar fora, títulos dinâmicos por página, cursor pointer automático

## 📁 Estrutura do Projeto

```
src/
├── assets/            # Imagens e recursos estáticos
│   └── logo.png
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
│   ├── Activity.tsx
│   ├── Calculator.tsx
│   ├── Categories.tsx
│   ├── Dashboard.tsx
│   ├── ForgotPassword.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ResetPassword.tsx
│   └── Transactions.tsx
├── services/          # Comunicação com a API
│   ├── activity.ts
│   ├── api.ts
│   ├── categories.ts
│   ├── summary.ts
│   └── transactions.ts
├── types/             # Tipagens TypeScript
│   ├── activity.ts
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
5. Use os filtros para pesquisar por título, tipo, categoria ou período
6. Visualize o resumo no "Dashboard" com filtro de data
7. Acompanhe todas as ações em "Histórico"

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
