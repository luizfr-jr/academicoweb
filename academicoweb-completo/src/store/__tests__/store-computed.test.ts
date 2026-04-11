import { useStore } from '../supabase-store';
import type { Disciplina, Usuario, Mensagem } from '../../types';

const mockDisciplina: Disciplina = {
  id: 'disc-1',
  nome: 'Programação I',
  codigo: 'CC101',
  emoji: '💻',
  periodo: '2025/1',
  descricao: 'Intro a programação',
  alunos: ['aluno-1', 'aluno-2'],
  atividades: [
    { id: 'atv-1', nome: 'Prova 1', tipo: 'AV1', data: '2025-03-15', peso: 3, media: 'M1' },
    { id: 'atv-2', nome: 'Trabalho 1', tipo: 'TR', data: '2025-03-20', peso: 2, media: 'M1' },
    { id: 'atv-3', nome: 'Prova 2', tipo: 'AV2', data: '2025-05-15', peso: 4, media: 'M2' },
    { id: 'atv-4', nome: 'Seminario', tipo: 'SEM', data: '2025-05-20', peso: 1, media: 'M2' },
    { id: 'atv-5', nome: 'Projeto Final', tipo: 'PF', data: '2025-06-15', peso: 5, media: 'M3' },
  ],
  notas: {
    'aluno-1': {
      'atv-1': 8,
      'atv-2': 7,
      'atv-3': 6,
      'atv-4': 9,
      'atv-5': null,
    },
    'aluno-2': {
      'atv-1': 5,
      'atv-2': 4,
    },
  },
  cor: 'blue',
};

const mockUsuarios: Usuario[] = [
  { id: 'prof-1', nome: 'Prof. Luiz', email: 'prof@ufn.edu.br', senha: '', role: 'professor', initials: 'PL' },
  { id: 'aluno-1', nome: 'João Almeida', email: 'joao@email.com', senha: '', role: 'aluno', initials: 'JA' },
  { id: 'aluno-2', nome: 'Maria Souza', email: 'maria@email.com', senha: '', role: 'aluno', initials: 'MS' },
  { id: 'aluno-3', nome: 'Carlos Lima', email: 'carlos@email.com', senha: '', role: 'aluno', initials: 'CL' },
];

const mockMensagens: Mensagem[] = [
  { id: 'msg-1', discId: 'disc-1', alunoId: 'aluno-1', assunto: 'Duvida', msg: 'Texto', data: '01/01/2025', lida: false },
  { id: 'msg-2', discId: 'disc-1', alunoId: 'aluno-2', assunto: 'Nota', msg: 'Texto', data: '02/01/2025', lida: true },
  { id: 'msg-3', discId: 'disc-2', alunoId: 'aluno-1', assunto: 'Outra', msg: 'Texto', data: '03/01/2025', lida: false },
];

function setupStore() {
  useStore.setState({
    disciplinas: [mockDisciplina],
    usuarios: mockUsuarios,
    mensagens: mockMensagens,
    currentUser: mockUsuarios[0],
    loading: false,
    error: null,
  });
}

beforeEach(() => {
  setupStore();
});

describe('calcMedia', () => {
  it('calculates weighted average for M1', () => {
    const result = useStore.getState().calcMedia('disc-1', 'aluno-1', 'M1');
    // (8*3 + 7*2) / (3+2) = (24+14)/5 = 38/5 = 7.6
    expect(result).toBe(7.6);
  });

  it('calculates weighted average for M2', () => {
    const result = useStore.getState().calcMedia('disc-1', 'aluno-1', 'M2');
    // (6*4 + 9*1) / (4+1) = (24+9)/5 = 33/5 = 6.6
    expect(result).toBe(6.6);
  });

  it('returns null when all grades are null', () => {
    const result = useStore.getState().calcMedia('disc-1', 'aluno-1', 'M3');
    // atv-5 has null grade, only activity in M3
    expect(result).toBeNull();
  });

  it('returns null for non-existent discipline', () => {
    const result = useStore.getState().calcMedia('non-existent', 'aluno-1', 'M1');
    expect(result).toBeNull();
  });

  it('returns null when student has no grades', () => {
    const result = useStore.getState().calcMedia('disc-1', 'aluno-3', 'M1');
    expect(result).toBeNull();
  });

  it('handles partial grades correctly', () => {
    const result = useStore.getState().calcMedia('disc-1', 'aluno-2', 'M1');
    // aluno-2: (5*3 + 4*2) / (3+2) = (15+8)/5 = 23/5 = 4.6
    expect(result).toBe(4.6);
  });

  it('includes grade of 0 (not treated as null)', () => {
    useStore.setState({
      disciplinas: [{
        ...mockDisciplina,
        notas: { 'aluno-1': { 'atv-1': 0, 'atv-2': 10 } },
      }],
    });
    const result = useStore.getState().calcMedia('disc-1', 'aluno-1', 'M1');
    // (0*3 + 10*2) / (3+2) = 20/5 = 4
    expect(result).toBe(4);
  });
});

describe('calcMediaFinal', () => {
  it('calculates average of available medias', () => {
    const result = useStore.getState().calcMediaFinal('disc-1', 'aluno-1');
    // M1=7.6, M2=6.6, M3=null -> (7.6+6.6)/2 = 14.2/2 = 7.1
    expect(result).toBe(7.1);
  });

  it('returns null when no medias available', () => {
    const result = useStore.getState().calcMediaFinal('disc-1', 'aluno-3');
    expect(result).toBeNull();
  });

  it('returns single media when only one is available', () => {
    const result = useStore.getState().calcMediaFinal('disc-1', 'aluno-2');
    // aluno-2 only has M1=4.6, M2 and M3 have no grades
    expect(result).toBe(4.6);
  });

  it('returns null for non-existent discipline', () => {
    const result = useStore.getState().calcMediaFinal('non-existent', 'aluno-1');
    expect(result).toBeNull();
  });
});

describe('getAlunosDaDisciplina', () => {
  it('returns enrolled students', () => {
    const result = useStore.getState().getAlunosDaDisciplina('disc-1');
    expect(result).toHaveLength(2);
    expect(result.map(u => u.id)).toEqual(['aluno-1', 'aluno-2']);
  });

  it('returns empty array for unknown discipline', () => {
    const result = useStore.getState().getAlunosDaDisciplina('non-existent');
    expect(result).toEqual([]);
  });
});

describe('getDisciplinasDoAluno', () => {
  it('returns disciplines where student is enrolled', () => {
    const result = useStore.getState().getDisciplinasDoAluno('aluno-1');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('disc-1');
  });

  it('returns empty for non-enrolled student', () => {
    const result = useStore.getState().getDisciplinasDoAluno('aluno-3');
    expect(result).toEqual([]);
  });
});

describe('getUnreadCount', () => {
  it('counts all unread messages without filter', () => {
    const result = useStore.getState().getUnreadCount();
    expect(result).toBe(2); // msg-1 and msg-3
  });

  it('counts unread for specific discipline', () => {
    const result = useStore.getState().getUnreadCount('disc-1');
    expect(result).toBe(1); // only msg-1
  });

  it('returns 0 when all messages are read', () => {
    useStore.setState({
      mensagens: mockMensagens.map(m => ({ ...m, lida: true })),
    });
    const result = useStore.getState().getUnreadCount();
    expect(result).toBe(0);
  });
});
