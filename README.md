# MomEase

MomEase ajuda mães a organizar tarefas da casa, acompanhar a participação dos filhos e incentivar colaboração com estrelas e prêmios.

## Funcionalidades

- Cadastro exclusivo para mães, com criação automática de uma família.
- Login único para mães e filhos, com redirecionamento baseado no perfil.
- Painel da mãe para cadastrar filhos, tarefas e prêmios.
- Painel do filho para visualizar tarefas, concluir atividades e resgatar prêmios.
- Sistema de estrelas para recompensar tarefas concluídas no prazo.
- Criação de contas de filhos via Server Action usando Supabase Admin API, sem deslogar a mãe.

## Tecnologias

- Next.js com App Router
- Supabase Auth e Database
- Server Actions para regras de negócio
- Tailwind CSS
- TypeScript

## Setup

1. Instale as dependências:

```bash
npm install
```

2. Crie `.env.local` a partir de `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` nos projetos Supabase novos. A chave anon antiga também é aceita como fallback.

3. Rode o SQL em `supabase/schema.sql` no SQL Editor do Supabase.

4. Inicie o app:

```bash
npm run dev
```

## Fluxo

- `/register`: cadastro exclusivo para mães. Gera um `family_id` único e cria o perfil da mãe.
- `/login`: login único para mães e filhos. O dashboard é escolhido pelo `role` salvo em `profiles`.
- `/mother`: painel da mãe para criar filhos, tarefas e prêmios.
- `/child`: painel do filho para concluir tarefas e resgatar prêmios.

## Segurança

O arquivo `.env.local` não deve ser enviado ao GitHub. Ele contém as chaves reais do Supabase e já está protegido pelo `.gitignore`.

A criação de filhos fica em `app/actions/mother.ts`, na action `createChildAccount`. Ela usa `supabase.auth.admin.createUser` com `SUPABASE_SERVICE_ROLE_KEY` apenas no servidor, preservando a sessão da mãe.
