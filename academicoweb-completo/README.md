# AcademicoWeb - Sistema de Gestao de Notas Academicas

Sistema web para gestao de notas academicas da **UFN (Universidade Franciscana)**. Permite que professores gerenciem disciplinas, alunos, atividades e notas, enquanto alunos acompanham seu desempenho em tempo real.

## Stack Tecnologica

- **React** 19.2.4
- **TypeScript** 6.0.2
- **Vite** 8.0.4
- **Tailwind CSS** 3.4.1
- **shadcn/ui** (componentes Radix + CVA)
- **Zustand** 5.0.12 (gerenciamento de estado)
- **Supabase** (backend PostgreSQL + autenticacao)
- **Zod** (validacao de schemas)

## Pre-requisitos

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) (gerenciador de pacotes)

## Como Executar Localmente

```bash
# 1. Clone o repositorio
git clone https://github.com/luizfr-jr/academicoweb.git
cd academicoweb/academicoweb-completo

# 2. Instale as dependencias
pnpm install

# 3. Configure as variaveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do Supabase

# 4. Inicie o servidor de desenvolvimento
pnpm dev
```

O aplicativo estara disponivel em `http://localhost:5173`.

## Variaveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (`academicoweb-completo/`) com as seguintes variaveis:

```env
VITE_SUPABASE_URL=<url-do-seu-projeto-supabase>
VITE_SUPABASE_ANON_KEY=<chave-anon-do-supabase>
```

## Configuracao do Banco de Dados

Execute o arquivo `supabase-setup.sql` no editor SQL do seu projeto Supabase para criar as tabelas necessarias.

## Scripts Disponiveis

| Comando         | Descricao                              |
|-----------------|----------------------------------------|
| `pnpm dev`      | Servidor de desenvolvimento (Vite)     |
| `pnpm build`    | Build de producao (TypeScript + Vite)  |
| `pnpm lint`     | Verificacao de codigo (ESLint)         |
| `pnpm test`     | Execucao de testes (Vitest)            |
| `pnpm preview`  | Servir build de producao localmente    |

## Deploy

O deploy e feito automaticamente via **GitHub Actions** para o **GitHub Pages**.

O workflow esta configurado em `.github/workflows/deploy.yml` e e acionado a cada push na branch principal.

## Credenciais de Demonstracao

| Papel      | Email                  | Senha     |
|------------|------------------------|-----------|
| Professor  | professor@ufn.edu.br   | prof123   |
| Aluno      | aluno@ufn.edu.br       | aluno123  |

## Licenca

Projeto academico - UFN (Universidade Franciscana).
