import { createClient } from '@supabase/supabase-js';

// Substitua pelos valores do seu projeto Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('⚠️ Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não configuradas!');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tipos que espelham as tabelas do banco
export type DbUsuario = {
  id: string;
  nome: string;
  email: string;
  role: 'professor' | 'aluno';
  initials: string;
  created_at?: string;
};

export type DbDisciplina = {
  id: string;
  nome: string;
  codigo: string;
  emoji: string;
  periodo: string;
  descricao: string;
  cor: string;
  professor_id: string;
  created_at?: string;
};

export type DbMatricula = {
  id: string;
  disciplina_id: string;
  aluno_id: string;
  created_at?: string;
};

export type DbAtividade = {
  id: string;
  disciplina_id: string;
  nome: string;
  tipo: string;
  data: string;
  peso: number;
  media: 'M1' | 'M2' | 'M3';
  descricao?: string;
  created_at?: string;
};

export type DbNota = {
  id: string;
  atividade_id: string;
  aluno_id: string;
  disciplina_id: string;
  valor: number | null;
  created_at?: string;
  updated_at?: string;
};

export type DbMensagem = {
  id: string;
  disciplina_id: string;
  aluno_id: string;
  assunto: string;
  mensagem: string;
  lida: boolean;
  created_at?: string;
};
