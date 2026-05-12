# 🎨 uTask 3.0 - Design Brief (Refatoração Visual)

## 📌 Projeto
- **Nome**: uTask 3.0
- **Tipo**: Kanban com autenticação
- **Figma**: https://www.figma.com/design/TSv8V1OmICO3EwqgV6xMRS/PS---uTask-24.1

## 🎨 Stack Tecnológico (NÃO MUDAR)
- **Frontend**: React + Vite + TypeScript
- **Backend**: Fastify + TypeORM + Postgres
- **Autenticação**: JWT + bcrypt
- **Libs obrigatórias**:
  - React Router (navegação)
  - Axios (HTTP)
  - Toast (notificações)
  - ContextAPI (DarkMode)
  - React Beautiful DnD ou DND Kit (Drag & Drop)

## 🌐 Telas para Refatorar

### 1. Login
- Arquivo: `src/pages/Login.tsx`
- Funcionalidades que DEVEM manter:
  - ✅ Campo email + senha
  - ✅ Botão login (chamar API)
  - ✅ Link para cadastro
  - ✅ Suporte dark/light mode
  - ✅ Responsivo (mobile/desktop)
- Não mexer em:
  - ✅ Lógica de autenticação
  - ✅ JWT token handling
  - ✅ Redirect para dashboard

### 2. Cadastro
- Arquivo: `src/pages/Register.tsx`
- Funcionalidades que DEVEM manter:
  - ✅ Campos: nome, email, senha, confirmação
  - ✅ Validação de formulário
  - ✅ Chamada API POST /register
  - ✅ Criptografia bcrypt (backend)
  - ✅ Suporte dark/light mode
  - ✅ Responsivo
- Não mexer em:
  - ✅ Lógica de validação
  - ✅ Hash de senha

### 3. Header
- Arquivo: `src/components/Header.tsx`
- Funcionalidades que DEVEM manter:
  - ✅ Logo
  - ✅ Toggle Dark/Light Mode (ContextAPI)
  - ✅ Botão logout
  - ✅ Navegação
- Não mexer em:
  - ✅ Context de tema
  - ✅ Lógica de logout

### 4. Kanban
- Arquivo: `src/pages/Dashboard.tsx` ou `src/pages/Kanban.tsx`
- Funcionalidades que DEVEM manter:
  - ✅ Drag & Drop entre colunas
  - ✅ CRUD de cards (Create, Read, Update, Delete)
  - ✅ 3 colunas: To Do, In Progress, Done
  - ✅ Isolamento de cards por usuário (userId)
  - ✅ Sincronização com API em tempo real
  - ✅ Suporte dark/light mode
  - ✅ Responsivo
- Não mexer em:
  - ✅ Lógica de drag&drop
  - ✅ Chamadas da API
  - ✅ Estado das tasks
  - ✅ Eventos de mouse/touch

### 5. Quote do Dia
- Arquivo: `src/components/DailyQuote.tsx`
- Funcionalidades que DEVEM manter:
  - ✅ Integração API de quotes
  - ✅ Exibição de frase do dia
  - ✅ Suporte dark/light mode
- Não mexer em:
  - ✅ Chamada da API

### 6. Footer
- Arquivo: `src/components/Footer.tsx`
- Apenas refatorar visual

## 🎨 Design Details (Do Figma)

### Cores (Extrair do Figma)
