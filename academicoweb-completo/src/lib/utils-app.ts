export const notaColor = (n: number | null): string => {
  if (n === null || n === undefined) return 'text-muted-foreground';
  if (n >= 7) return 'text-emerald-600 dark:text-emerald-400';
  if (n >= 5) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

export const notaBg = (n: number | null): string => {
  if (n === null || n === undefined) return 'bg-muted text-muted-foreground';
  if (n >= 7) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
  if (n >= 5) return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
  return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
};

export const notaBgCard = (n: number | null): string => {
  if (n === null || n === undefined) return '';
  if (n >= 7) return 'border-l-4 border-l-emerald-500';
  if (n >= 5) return 'border-l-4 border-l-amber-500';
  return 'border-l-4 border-l-red-500';
};

export const situacao = (n: number | null): string => {
  if (n === null) return 'Pendente';
  if (n >= 7) return 'Aprovado';
  if (n >= 5) return 'Recuperação';
  return 'Reprovado';
};

export const situacaoBadge = (n: number | null): string => {
  if (n === null) return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  if (n >= 7) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400';
  if (n >= 5) return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400';
  return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400';
};

export const formatNota = (n: number | null | undefined): string => {
  if (n === null || n === undefined) return '—';
  return n.toFixed(1);
};

export const periodoLabel = (p: string): string => {
  const [ano, sem] = p.split('/');
  return `${sem}º Semestre de ${ano}`;
};

export const isAtivo = (periodo: string): boolean => {
  const [ano, sem] = periodo.split('/');
  const now = new Date();
  const anoAtual = now.getFullYear();
  const semAtual = now.getMonth() < 6 ? 1 : 2;
  return parseInt(ano) === anoAtual && parseInt(sem) === semAtual;
};

export const isConcluido = (periodo: string): boolean => {
  const [ano, sem] = periodo.split('/');
  const now = new Date();
  const anoAtual = now.getFullYear();
  const semAtual = now.getMonth() < 6 ? 1 : 2;
  if (parseInt(ano) < anoAtual) return true;
  if (parseInt(ano) === anoAtual && parseInt(sem) < semAtual) return true;
  return false;
};

export const COR_MAP: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  green: {
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    dot: 'bg-purple-500',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
    dot: 'bg-orange-500',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950',
    text: 'text-teal-700 dark:text-teal-300',
    border: 'border-teal-200 dark:border-teal-800',
    dot: 'bg-teal-500',
  },
};

export const EMOJIS_SUGERIDOS = [
  '📐', '🔬', '💻', '🗄️', '🤖', '🌐', '📊', '🧮', '🔧', '📚',
  '🎨', '🧪', '🏛️', '⚡', '🌍', '📡', '🔐', '🧠', '🎯', '🚀',
];

export const CORES_DISPONIVEIS = ['blue', 'green', 'purple', 'orange', 'red', 'teal'];
export const PERIODOS = ['2026/1', '2026/2', '2025/1', '2025/2', '2024/1', '2024/2', '2023/2', '2023/1'];
export const TIPOS_ATIVIDADE = ['AV1', 'AV2', 'AV3', 'TR', 'PR', 'QZ', 'SEM', 'LAB', 'EX', 'ART', 'PF'];
