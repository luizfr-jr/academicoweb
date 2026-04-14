export type Role = 'professor' | 'aluno';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: Role;
  initials: string;
  avatar?: string;
}

export type MediaGrupo = 'M1' | 'M2' | 'M3';

export interface Atividade {
  id: string;
  nome: string;
  tipo: string;
  data: string;
  peso: number;
  media: MediaGrupo;
  descricao?: string;
}

export interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
  emoji: string;
  periodo: string;
  descricao: string;
  alunos: string[];
  atividades: Atividade[];
  notas: Record<string, Record<string, number | null>>;
  cor: string;
}

export interface Mensagem {
  id: string;
  discId: string;
  alunoId: string;
  assunto: string;
  msg: string;
  data: string;
  lida: boolean;
}

export interface AppState {
  usuarios: Usuario[];
  disciplinas: Disciplina[];
  mensagens: Mensagem[];
}

export interface MediaCalc {
  valor: number | null;
  atividadesCount: number;
  notasCount: number;
}
