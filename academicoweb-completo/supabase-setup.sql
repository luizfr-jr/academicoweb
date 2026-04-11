-- ============================================================
--  AcadêmicoWeb — Script completo de banco de dados
--  Cole este script no SQL Editor do Supabase e execute.
--  Supabase Dashboard → SQL Editor → New Query → Cole → Run
-- ============================================================

-- ── 1. TABELA: usuarios ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.usuarios (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  senha_hash  TEXT NOT NULL,          -- senha simples (sem criptografia Supabase Auth)
  role        TEXT NOT NULL CHECK (role IN ('professor', 'aluno')),
  initials    TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── 2. TABELA: disciplinas ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.disciplinas (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id  UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  codigo        TEXT NOT NULL DEFAULT '',
  emoji         TEXT NOT NULL DEFAULT '📚',
  periodo       TEXT NOT NULL DEFAULT '',
  descricao     TEXT DEFAULT '',
  cor           TEXT DEFAULT 'blue',
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ── 3. TABELA: matriculas ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.matriculas (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disciplina_id  UUID NOT NULL REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  aluno_id       UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  created_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE (disciplina_id, aluno_id)
);

-- ── 4. TABELA: atividades ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.atividades (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disciplina_id  UUID NOT NULL REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  nome           TEXT NOT NULL,
  tipo           TEXT NOT NULL DEFAULT 'AV',
  data           DATE NOT NULL,
  peso           NUMERIC(4,2) NOT NULL DEFAULT 1.0 CHECK (peso > 0),
  media          TEXT NOT NULL CHECK (media IN ('M1', 'M2', 'M3')),
  descricao      TEXT DEFAULT '',
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ── 5. TABELA: notas ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notas (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disciplina_id  UUID NOT NULL REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  atividade_id   UUID NOT NULL REFERENCES public.atividades(id) ON DELETE CASCADE,
  aluno_id       UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  valor          NUMERIC(4,2) CHECK (valor IS NULL OR (valor >= 0 AND valor <= 10)),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  created_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE (disciplina_id, atividade_id, aluno_id)
);

-- ── 6. TABELA: mensagens ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mensagens (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disciplina_id  UUID NOT NULL REFERENCES public.disciplinas(id) ON DELETE CASCADE,
  aluno_id       UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
  assunto        TEXT NOT NULL,
  mensagem       TEXT NOT NULL,
  lida           BOOLEAN DEFAULT false,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
--  Garante que cada aluno só acessa os próprios dados
-- ============================================================

ALTER TABLE public.usuarios    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disciplinas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matriculas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atividades  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens   ENABLE ROW LEVEL SECURITY;

-- ATENÇÃO: como usamos autenticação própria (não o Supabase Auth),
-- desabilitamos RLS para a anon key (o frontend usa a anon key).
-- A segurança é feita pela lógica do frontend + queries filtradas.
-- Em produção avançada, use Supabase Auth e as policies abaixo.

-- Por ora, permite leitura/escrita pela anon key (frontend):
CREATE POLICY "acesso_anon_usuarios"    ON public.usuarios    FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "acesso_anon_disciplinas" ON public.disciplinas FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "acesso_anon_matriculas"  ON public.matriculas  FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "acesso_anon_atividades"  ON public.atividades  FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "acesso_anon_notas"       ON public.notas       FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "acesso_anon_mensagens"   ON public.mensagens   FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
--  DADOS INICIAIS (seed)
--  Professor + alunos de exemplo para você começar
-- ============================================================

-- Professor
INSERT INTO public.usuarios (id, nome, email, senha_hash, role, initials) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Prof. Luiz Porto', 'prof@ufn.edu.br', '123', 'professor', 'LP')
ON CONFLICT (email) DO NOTHING;

-- Alunos de exemplo
INSERT INTO public.usuarios (id, nome, email, senha_hash, role, initials) VALUES
  ('00000000-0000-0000-0000-000000000002', 'João Almeida',  'joao@email.com',   '123', 'aluno', 'JA'),
  ('00000000-0000-0000-0000-000000000003', 'Maria Souza',   'maria@email.com',  '123', 'aluno', 'MS'),
  ('00000000-0000-0000-0000-000000000004', 'Carlos Lima',   'carlos@email.com', '123', 'aluno', 'CL')
ON CONFLICT (email) DO NOTHING;

-- Disciplina de exemplo
INSERT INTO public.disciplinas (id, professor_id, nome, codigo, emoji, periodo, descricao, cor) VALUES
  ('00000000-0000-0000-0000-000000000010',
   '00000000-0000-0000-0000-000000000001',
   'Banco de Dados', 'BD301', '🗄️', '2025/1',
   'Modelagem relacional, SQL avançado, normalização e sistemas gerenciadores.', 'blue')
ON CONFLICT DO NOTHING;

-- Matrículas dos alunos na disciplina
INSERT INTO public.matriculas (disciplina_id, aluno_id) VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000003'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;

-- Atividades da disciplina
INSERT INTO public.atividades (id, disciplina_id, nome, tipo, data, peso, media) VALUES
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', 'Prova 1',       'AV1', '2025-03-20', 3.0, 'M1'),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010', 'Trabalho ER',   'TR',  '2025-04-10', 2.0, 'M1'),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000010', 'Quiz SQL',      'QZ',  '2025-05-05', 1.0, 'M2'),
  ('00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000010', 'Prova 2',       'AV2', '2025-05-22', 3.0, 'M2'),
  ('00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000010', 'Projeto Final', 'PF',  '2025-07-10', 4.0, 'M3')
ON CONFLICT DO NOTHING;

-- Notas de exemplo
INSERT INTO public.notas (disciplina_id, atividade_id, aluno_id, valor) VALUES
  -- João
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000002', 8.5),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002', 9.0),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000002', 7.5),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000002', 8.0),
  -- Maria
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000003', 6.0),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000003', 7.5),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000003', 5.0),
  -- Carlos
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000004', 9.5),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000004', 10.0),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000004', 9.0)
ON CONFLICT DO NOTHING;

-- ============================================================
--  PRONTO! Execute este script e depois configure o frontend.
-- ============================================================
