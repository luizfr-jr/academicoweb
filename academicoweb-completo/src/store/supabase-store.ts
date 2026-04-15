import { create } from 'zustand';
import { supabase, type DbMatricula, type DbAtividade, type DbNota, type DbMensagem } from '../lib/supabase';
import type { Disciplina, Usuario, Atividade, Mensagem, MediaGrupo } from '../types';

// ─── helpers ────────────────────────────────────────────────────────────────
const uid = () => crypto.randomUUID();

const makeInitials = (nome: string) =>
  nome.split(' ').filter(Boolean).map((p) => p[0]).slice(0, 2).join('').toUpperCase();

// ─── store interface ─────────────────────────────────────────────────────────
interface Store {
  // runtime state
  currentUser: Usuario | null;
  disciplinas: Disciplina[];
  usuarios: Usuario[];
  mensagens: Mensagem[];
  loading: boolean;
  error: string | null;

  // auth
  login: (email: string, senha: string, role: string) => Promise<boolean>;
  register: (nome: string, email: string, senha: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;

  // bootstrap
  loadData: () => Promise<void>;

  // disciplinas
  addDisciplina: (d: Omit<Disciplina, 'id' | 'alunos' | 'atividades' | 'notas'>) => Promise<void>;
  updateDisciplina: (id: string, data: Partial<Disciplina>) => Promise<void>;
  removeDisciplina: (id: string) => Promise<void>;

  // atividades
  addAtividade: (discId: string, a: Omit<Atividade, 'id'>) => Promise<void>;
  updateAtividade: (discId: string, atvId: string, data: Partial<Atividade>) => Promise<void>;
  removeAtividade: (discId: string, atvId: string) => Promise<void>;

  // alunos
  addAlunoToDisciplina: (discId: string, userData: { nome: string; email: string; senha: string }) => Promise<string>;
  removeAlunoFromDisciplina: (discId: string, alunoId: string) => Promise<void>;

  // notas
  setNota: (discId: string, alunoId: string, atvId: string, valor: number | null) => Promise<void>;
  setMultipleNotas: (discId: string, alunoId: string, notas: Record<string, number | null>) => Promise<void>;

  // mensagens
  addMensagem: (m: Omit<Mensagem, 'id' | 'data' | 'lida'>) => Promise<void>;
  markMensagemLida: (id: string) => Promise<void>;

  // password
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;

  // computed (pure, no DB call)
  calcMedia: (discId: string, alunoId: string, qual: MediaGrupo) => number | null;
  calcMediaFinal: (discId: string, alunoId: string) => number | null;
  getAlunosDaDisciplina: (discId: string) => Usuario[];
  getDisciplinasDoAluno: (alunoId: string) => Disciplina[];
  getMensagensDaDisciplina: (discId: string) => Mensagem[];
  getUnreadCount: (discId?: string) => number;
}

export const useStore = create<Store>()((set, get) => ({
  currentUser: null,
  disciplinas: [],
  usuarios: [],
  mensagens: [],
  loading: false,
  error: null,

  // ── AUTH ────────────────────────────────────────────────────────────────────
  login: async (email, senha, role) => {
    set({ loading: true, error: null });
    // Busca o usuário na tabela usuarios (autenticação simples por email+senha)
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .eq('senha_hash', senha)
      .eq('role', role)
      .single();

    if (error || !data) {
      set({ loading: false, error: 'E-mail, senha ou tipo de acesso inválidos.' });
      return false;
    }

    const user: Usuario = {
      id: data.id,
      nome: data.nome,
      email: data.email,
      senha: data.senha_hash,
      role: data.role,
      initials: data.initials,
    };

    set({ currentUser: user, loading: false });
    await get().loadData();
    return true;
  },

  register: async (nome, email, senha, role) => {
    set({ loading: true, error: null });

    // Verifica se já existe usuário com esse email
    const { data: existing } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing) {
      set({ loading: false, error: 'Já existe uma conta com esse e-mail.' });
      return false;
    }

    const id = uid();
    const initials = makeInitials(nome);

    const { error } = await supabase.from('usuarios').insert({
      id,
      nome: nome.trim(),
      email: email.toLowerCase().trim(),
      senha_hash: senha,
      role,
      initials,
    });

    if (error) {
      set({ loading: false, error: 'Erro ao criar conta. Tente novamente.' });
      return false;
    }

    const user: Usuario = {
      id,
      nome: nome.trim(),
      email: email.toLowerCase().trim(),
      senha,
      role: role as 'professor' | 'aluno',
      initials,
    };

    set({ currentUser: user, loading: false });
    await get().loadData();
    return true;
  },

  logout: async () => {
    set({ currentUser: null, disciplinas: [], usuarios: [], mensagens: [] });
  },

  // ── LOAD DATA ──────────────────────────────────────────────────────────────
  loadData: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    set({ loading: true });

    try {
      // Carrega todos os usuários (para mostrar nomes na tabela de notas)
      const { data: usersData } = await supabase.from('usuarios').select('*');
      const usuarios: Usuario[] = (usersData || []).map((u) => ({
        id: u.id, nome: u.nome, email: u.email,
        senha: '', role: u.role, initials: u.initials,
      }));

      // Carrega disciplinas acessíveis ao usuário
      let discQuery = supabase.from('disciplinas').select('*');
      if (currentUser.role === 'professor') {
        discQuery = discQuery.eq('professor_id', currentUser.id);
      }
      const { data: discsData } = await discQuery.order('created_at', { ascending: false });

      const discIds = (discsData || []).map(d => d.id);

      // Carrega todas as relações em paralelo (evita N+1 queries)
      const [matriculasResult, atividadesResult, notasResult] = await Promise.all([
        supabase.from('matriculas').select('*').in('disciplina_id', discIds),
        supabase.from('atividades').select('*').in('disciplina_id', discIds).order('data', { ascending: true }),
        currentUser.role === 'professor'
          ? supabase.from('notas').select('*').in('disciplina_id', discIds)
          : supabase.from('notas').select('*').in('disciplina_id', discIds).eq('aluno_id', currentUser.id),
      ]);

      const allMatriculas = (matriculasResult.data || []) as DbMatricula[];
      const allAtividades = (atividadesResult.data || []) as DbAtividade[];
      const allNotas = (notasResult.data || []) as DbNota[];

      // Agrupa por disciplina em memória
      const disciplinas: Disciplina[] = [];

      for (const disc of (discsData || [])) {
        const alunoIds = allMatriculas
          .filter((m: DbMatricula) => m.disciplina_id === disc.id)
          .map((m: DbMatricula) => m.aluno_id);

        if (currentUser.role === 'aluno' && !alunoIds.includes(currentUser.id)) continue;

        const atividades: Atividade[] = allAtividades
          .filter((a: DbAtividade) => a.disciplina_id === disc.id)
          .map((a: DbAtividade) => ({
            id: a.id, nome: a.nome, tipo: a.tipo, data: a.data,
            peso: a.peso, media: a.media, descricao: a.descricao,
          }));

        const notas: Record<string, Record<string, number | null>> = {};
        allNotas
          .filter((n: DbNota) => n.disciplina_id === disc.id)
          .forEach((n: DbNota) => {
            if (!notas[n.aluno_id]) notas[n.aluno_id] = {};
            notas[n.aluno_id][n.atividade_id] = n.valor;
          });

        disciplinas.push({
          id: disc.id, nome: disc.nome, codigo: disc.codigo,
          emoji: disc.emoji, periodo: disc.periodo, descricao: disc.descricao,
          cor: disc.cor, alunos: alunoIds, atividades, notas,
        });
      }

      // Mensagens
      let msgsQuery = supabase.from('mensagens').select('*');
      if (currentUser.role === 'aluno') msgsQuery = msgsQuery.eq('aluno_id', currentUser.id);
      const { data: msgsData } = await msgsQuery.order('created_at', { ascending: false });

      const mensagens: Mensagem[] = (msgsData || []).map((m: DbMensagem) => ({
        id: m.id, discId: m.disciplina_id, alunoId: m.aluno_id,
        assunto: m.assunto, msg: m.mensagem, lida: m.lida,
        data: new Date(m.created_at || Date.now()).toLocaleString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        }),
      }));

      set({ disciplinas, usuarios, mensagens, loading: false });
    } catch (e) {
      set({ loading: false, error: 'Erro ao carregar dados. Tente novamente.' });
    }
  },

  // ── DISCIPLINAS ─────────────────────────────────────────────────────────────
  addDisciplina: async (d) => {
    const { currentUser } = get();
    if (!currentUser) return;
    const { data, error } = await supabase.from('disciplinas').insert({
      id: uid(), nome: d.nome, codigo: d.codigo, emoji: d.emoji,
      periodo: d.periodo, descricao: d.descricao, cor: d.cor,
      professor_id: currentUser.id,
    }).select().single();
    if (!error && data) {
      const nova: Disciplina = {
        id: data.id, nome: data.nome, codigo: data.codigo, emoji: data.emoji,
        periodo: data.periodo, descricao: data.descricao, cor: data.cor,
        alunos: [], atividades: [], notas: {},
      };
      set((s) => ({ disciplinas: [nova, ...s.disciplinas] }));
    }
  },

  updateDisciplina: async (id, data) => {
    const dbData: Record<string, any> = {};
    if (data.nome) dbData.nome = data.nome;
    if (data.codigo) dbData.codigo = data.codigo;
    if (data.emoji) dbData.emoji = data.emoji;
    if (data.periodo) dbData.periodo = data.periodo;
    if (data.descricao !== undefined) dbData.descricao = data.descricao;
    if (data.cor) dbData.cor = data.cor;
    await supabase.from('disciplinas').update(dbData).eq('id', id);
    set((s) => ({
      disciplinas: s.disciplinas.map((d) => (d.id === id ? { ...d, ...data } : d)),
    }));
  },

  removeDisciplina: async (id) => {
    await supabase.from('disciplinas').delete().eq('id', id);
    set((s) => ({
      disciplinas: s.disciplinas.filter((d) => d.id !== id),
      mensagens: s.mensagens.filter((m) => m.discId !== id),
    }));
  },

  // ── ATIVIDADES ──────────────────────────────────────────────────────────────
  addAtividade: async (discId, a) => {
    const { data, error } = await supabase.from('atividades').insert({
      id: uid(), disciplina_id: discId, nome: a.nome, tipo: a.tipo,
      data: a.data, peso: a.peso, media: a.media, descricao: a.descricao,
    }).select().single();
    if (!error && data) {
      const nova: Atividade = {
        id: data.id, nome: data.nome, tipo: data.tipo, data: data.data,
        peso: data.peso, media: data.media, descricao: data.descricao,
      };
      set((s) => ({
        disciplinas: s.disciplinas.map((d) =>
          d.id === discId ? { ...d, atividades: [...d.atividades, nova] } : d
        ),
      }));
    }
  },

  updateAtividade: async (discId, atvId, data) => {
    const dbData: Record<string, any> = {};
    if (data.nome) dbData.nome = data.nome;
    if (data.tipo) dbData.tipo = data.tipo;
    if (data.data) dbData.data = data.data;
    if (data.peso !== undefined) dbData.peso = data.peso;
    if (data.media) dbData.media = data.media;
    if (data.descricao !== undefined) dbData.descricao = data.descricao;
    await supabase.from('atividades').update(dbData).eq('id', atvId);
    set((s) => ({
      disciplinas: s.disciplinas.map((d) =>
        d.id === discId
          ? { ...d, atividades: d.atividades.map((a) => (a.id === atvId ? { ...a, ...data } : a)) }
          : d
      ),
    }));
  },

  removeAtividade: async (discId, atvId) => {
    await supabase.from('atividades').delete().eq('id', atvId);
    set((s) => ({
      disciplinas: s.disciplinas.map((d) =>
        d.id === discId ? { ...d, atividades: d.atividades.filter((a) => a.id !== atvId) } : d
      ),
    }));
  },

  // ── ALUNOS ──────────────────────────────────────────────────────────────────
  addAlunoToDisciplina: async (discId, userData) => {
    // Verifica se já existe usuário com esse email
    let { data: existing } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', userData.email.toLowerCase().trim())
      .single();

    let alunoId: string;

    if (existing) {
      alunoId = existing.id;
    } else {
      // Cria novo usuário
      alunoId = uid();
      const initials = makeInitials(userData.nome);
      await supabase.from('usuarios').insert({
        id: alunoId,
        nome: userData.nome,
        email: userData.email.toLowerCase().trim(),
        senha_hash: userData.senha || '123',
        role: 'aluno',
        initials,
      });
      const novoUsuario: Usuario = {
        id: alunoId, nome: userData.nome,
        email: userData.email.toLowerCase().trim(),
        senha: '', role: 'aluno', initials,
      };
      set((s) => ({ usuarios: [...s.usuarios, novoUsuario] }));
    }

    // Cria matrícula
    await supabase.from('matriculas').upsert({
      id: uid(), disciplina_id: discId, aluno_id: alunoId,
    }, { onConflict: 'disciplina_id,aluno_id' });

    set((s) => ({
      disciplinas: s.disciplinas.map((d) =>
        d.id === discId && !d.alunos.includes(alunoId)
          ? { ...d, alunos: [...d.alunos, alunoId], notas: { ...d.notas, [alunoId]: {} } }
          : d
      ),
    }));

    return alunoId;
  },

  removeAlunoFromDisciplina: async (discId, alunoId) => {
    await supabase.from('matriculas')
      .delete().eq('disciplina_id', discId).eq('aluno_id', alunoId);
    set((s) => ({
      disciplinas: s.disciplinas.map((d) =>
        d.id === discId ? { ...d, alunos: d.alunos.filter((id) => id !== alunoId) } : d
      ),
    }));
  },

  // ── NOTAS ───────────────────────────────────────────────────────────────────
  setNota: async (discId, alunoId, atvId, valor) => {
    // Upsert: cria se não existe, atualiza se já existe
    await supabase.from('notas').upsert({
      id: uid(),
      disciplina_id: discId,
      atividade_id: atvId,
      aluno_id: alunoId,
      valor,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'disciplina_id,atividade_id,aluno_id' });

    set((s) => ({
      disciplinas: s.disciplinas.map((d) =>
        d.id === discId
          ? {
              ...d,
              notas: {
                ...d.notas,
                [alunoId]: { ...(d.notas[alunoId] || {}), [atvId]: valor },
              },
            }
          : d
      ),
    }));
  },

  setMultipleNotas: async (discId, alunoId, notas) => {
    const entries = Object.entries(notas);
    const records = entries.map(([atvId, valor]) => ({
      id: uid(),
      disciplina_id: discId,
      atividade_id: atvId,
      aluno_id: alunoId,
      valor,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from('notas').upsert(records, { onConflict: 'disciplina_id,atividade_id,aluno_id' });
    set((s) => ({
      disciplinas: s.disciplinas.map((d) =>
        d.id === discId
          ? { ...d, notas: { ...d.notas, [alunoId]: { ...(d.notas[alunoId] || {}), ...notas } } }
          : d
      ),
    }));
  },

  // ── MENSAGENS ───────────────────────────────────────────────────────────────
  addMensagem: async (m) => {
    const { data, error } = await supabase.from('mensagens').insert({
      id: uid(),
      disciplina_id: m.discId,
      aluno_id: m.alunoId,
      assunto: m.assunto,
      mensagem: m.msg,
      lida: false,
    }).select().single();

    if (!error && data) {
      const nova: Mensagem = {
        id: data.id, discId: data.disciplina_id, alunoId: data.aluno_id,
        assunto: data.assunto, msg: data.mensagem, lida: data.lida,
        data: new Date(data.created_at).toLocaleString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        }),
      };
      set((s) => ({ mensagens: [nova, ...s.mensagens] }));
    }
  },

  markMensagemLida: async (id) => {
    await supabase.from('mensagens').update({ lida: true }).eq('id', id);
    set((s) => ({
      mensagens: s.mensagens.map((m) => (m.id === id ? { ...m, lida: true } : m)),
    }));
  },

  // ── SENHA ──────────────────────────────────────────────────────────────────
  changePassword: async (currentPassword, newPassword) => {
    const { currentUser } = get();
    if (!currentUser) return false;

    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('id', currentUser.id)
      .eq('senha_hash', currentPassword)
      .single();

    if (error || !data) return false;

    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ senha_hash: newPassword })
      .eq('id', currentUser.id);

    return !updateError;
  },

  // ── COMPUTED (sem acesso ao banco) ─────────────────────────────────────────
  calcMedia: (discId, alunoId, qual) => {
    const d = get().disciplinas.find((x) => x.id === discId);
    if (!d) return null;
    const atvs = d.atividades.filter((a) => a.media === qual);
    if (!atvs.length) return null;
    const notas = d.notas[alunoId] || {};
    let soma = 0, pesos = 0;
    atvs.forEach((a) => {
      const n = notas[a.id];
      if (n !== null && n !== undefined) {
        soma += n * a.peso;
        pesos += a.peso;
      }
    });
    if (!pesos) return null;
    return Math.round((soma / pesos) * 10) / 10;
  },

  calcMediaFinal: (discId, alunoId) => {
    const medias = (['M1', 'M2', 'M3'] as MediaGrupo[])
      .map((m) => get().calcMedia(discId, alunoId, m))
      .filter((v): v is number => v !== null);
    if (!medias.length) return null;
    return Math.round((medias.reduce((a, b) => a + b, 0) / medias.length) * 10) / 10;
  },

  getAlunosDaDisciplina: (discId) => {
    const d = get().disciplinas.find((x) => x.id === discId);
    if (!d) return [];
    return get().usuarios.filter((u) => d.alunos.includes(u.id));
  },

  getDisciplinasDoAluno: (alunoId) =>
    get().disciplinas.filter((d) => d.alunos.includes(alunoId)),

  getMensagensDaDisciplina: (discId) =>
    get().mensagens.filter((m) => m.discId === discId),

  getUnreadCount: (discId) => {
    const msgs = get().mensagens;
    const filtered = discId ? msgs.filter((m) => m.discId === discId) : msgs;
    return filtered.filter((m) => !m.lida).length;
  },
}));
