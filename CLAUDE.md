# CLAUDE.md - AcademicoWeb

## Project Overview

AcademicoWeb is an academic grade management system built for UFN (Universidade Franciscana). It allows professors to manage courses (disciplinas), students, activities, and grades, and provides students with a read-only view of their grades and status. The UI is entirely in Portuguese (pt-BR).

## Tech Stack

- **React** 19.2.4
- **TypeScript** 6.0.2
- **Vite** 8.0.4
- **Tailwind CSS** 3.4.1 + tailwindcss-animate
- **shadcn/ui** (Radix primitives + CVA)
- **Zustand** 5.0.12 (state management)
- **Supabase** (PostgreSQL backend + auth)
- **Zod** 4 (schema validation)
- **Lucide React** (icons)
- **React Hook Form** + @hookform/resolvers

## Commands

```bash
pnpm dev        # Start Vite dev server
pnpm build      # TypeScript check + Vite production build
pnpm lint       # ESLint
pnpm test       # Vitest test runner
pnpm preview    # Serve production build locally
```

All commands run from `academicoweb-completo/`.

## Project Structure

```
academicoweb-completo/
├── src/
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui primitives (button, card, dialog, etc.)
│   │   ├── AppShell.tsx    # Root layout - auth gate, theme, toaster
│   │   ├── LoginScreen.tsx # Login form
│   │   ├── ProfessorView.tsx # Professor dashboard (manage disciplinas, grades)
│   │   ├── AlunoView.tsx   # Student read-only view
│   │   ├── DiscCard.tsx    # Disciplina card component
│   │   └── UserAvatar.tsx  # Avatar with initials
│   ├── store/
│   │   ├── supabase-store.ts # Zustand store (all state + async Supabase actions)
│   │   └── index.ts          # Re-export
│   ├── lib/
│   │   ├── supabase.ts     # Supabase client initialization
│   │   ├── utils.ts        # cn() classname utility (clsx + tailwind-merge)
│   │   └── utils-app.ts    # Grade color coding, situacao labels, formatNota
│   ├── types/
│   │   └── index.ts        # TypeScript interfaces (Disciplina, Usuario, Atividade, etc.)
│   ├── hooks/
│   │   └── use-toast.ts    # Toast hook
│   ├── data/
│   │   └── seed.ts         # Seed data
│   ├── App.tsx             # Root component (renders AppShell)
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind directives + CSS variables
├── supabase-setup.sql      # Database schema DDL
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages deployment
├── index.html              # SPA entry
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Architecture

- **SPA with no router** - single page, auth-gated. AppShell checks login state and renders either LoginScreen, ProfessorView, or AlunoView.
- **Zustand store** at `src/store/supabase-store.ts` - single store holds all state (currentUser, disciplinas, usuarios, mensagens). All mutations are async actions that write to Supabase then update local state.
- **shadcn/ui components** in `src/components/ui/` - standard Radix-based primitives.
- **Supabase** backend - all data persisted in PostgreSQL via `@supabase/supabase-js`.

## Grade Calculation

Grades are organized into three groups (MediaGrupo): **M1**, **M2**, **M3**.

Each group contains weighted activities (atividades). The media for a group is the weighted average of its activity grades:

```
Media(Mx) = sum(nota * peso) / sum(peso)
```

The **final grade** (media final) is the arithmetic mean of whichever medias (M1, M2, M3) have values:

```
MediaFinal = sum(available medias) / count(available medias)
```

If no medias have values, the final grade is `null`.

## Color Coding & Status

| Grade Range | Color   | Status (Situacao) |
|-------------|---------|-------------------|
| >= 7.0      | Green (emerald) | Aprovado    |
| 5.0 - 6.9  | Amber   | Recuperacao        |
| < 5.0       | Red     | Reprovado          |
| null        | Gray (muted) | Pendente      |

Implementation in `src/lib/utils-app.ts`: `notaColor()`, `notaBg()`, `situacao()`, `situacaoBadge()`, `formatNota()`.

## Coding Conventions

- **Portuguese UI text** - all labels, messages, and status strings in pt-BR
- **shadcn/ui components** - use primitives from `src/components/ui/`
- **`cn()`** for classNames - combines `clsx` + `tailwind-merge` (from `src/lib/utils.ts`)
- **`@/` path alias** - maps to `src/` (configured in tsconfig and vite)
- **No `any` types** - use proper TypeScript interfaces from `src/types/index.ts`
- **Async store actions** - all Supabase operations are async functions in the Zustand store
- **Lucide icons** - import from `lucide-react`
- **Zod validation** - form schemas use Zod

## Key Files

| File | Purpose |
|------|---------|
| `src/store/supabase-store.ts` | Central Zustand store - state, actions, computed |
| `src/components/AppShell.tsx` | Root layout, auth gate, theme provider |
| `src/components/ProfessorView.tsx` | Professor dashboard |
| `src/components/AlunoView.tsx` | Student dashboard |
| `src/components/LoginScreen.tsx` | Login form |
| `src/lib/utils-app.ts` | Grade colors, status labels |
| `src/lib/supabase.ts` | Supabase client |
| `src/types/index.ts` | All TypeScript interfaces |
| `supabase-setup.sql` | Database DDL |

## Testing

- **Vitest** test runner
- Test files in `__tests__/` directories adjacent to source
- Run with `pnpm test`

## Deployment

- **GitHub Pages** via GitHub Actions (`.github/workflows/deploy.yml`)
- Build output in `dist/`
- Repository: `luizfr-jr/academicoweb`

## Environment Variables

```
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
```
