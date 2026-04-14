import type { Disciplina, Usuario, MediaGrupo } from '@/types';
import { situacao, formatNota } from './utils-app';

export function exportGradesToCSV(
  disciplina: Disciplina,
  alunos: Usuario[],
  calcMedia: (discId: string, alunoId: string, qual: MediaGrupo) => number | null,
  calcMediaFinal: (discId: string, alunoId: string) => number | null,
) {
  const BOM = '\uFEFF';

  const atvHeaders = disciplina.atividades.map(a => `${a.nome} (${a.tipo})`);
  const headers = ['Nome', 'Email', ...atvHeaders, 'M1', 'M2', 'M3', 'Média Final', 'Situação'];

  const rows = alunos.map(al => {
    const notas = disciplina.notas[al.id] || {};
    const atvValues = disciplina.atividades.map(a => {
      const v = notas[a.id];
      return v !== null && v !== undefined ? v.toString() : '';
    });
    const m1 = calcMedia(disciplina.id, al.id, 'M1');
    const m2 = calcMedia(disciplina.id, al.id, 'M2');
    const m3 = calcMedia(disciplina.id, al.id, 'M3');
    const mf = calcMediaFinal(disciplina.id, al.id);

    return [
      al.nome,
      al.email,
      ...atvValues,
      formatNota(m1),
      formatNota(m2),
      formatNota(m3),
      formatNota(mf),
      situacao(mf),
    ];
  });

  const escapeCSV = (val: string) => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(',')),
  ].join('\n');

  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${disciplina.codigo}_${disciplina.periodo}_notas.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
