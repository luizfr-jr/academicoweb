import React from 'react';
import { useStore } from '@/store';
import type { Disciplina, MediaGrupo } from '@/types';
import { UserAvatar } from '@/components/UserAvatar';
import { cn } from '@/lib/utils';
import { formatNota, notaBg, notaColor, situacao, situacaoBadge } from '@/lib/utils-app';

export function TabNotas({ disc }: { disc: Disciplina }) {
  const { getAlunosDaDisciplina, setNota, calcMedia } = useStore();
  const alunos = getAlunosDaDisciplina(disc.id);
  const atvs = disc.atividades;

  if (!alunos.length) return <div className="text-center py-8 text-muted-foreground text-sm">Nenhum aluno matriculado. Adicione alunos na aba Alunos.</div>;
  if (!atvs.length) return <div className="text-center py-8 text-muted-foreground text-sm">Nenhuma atividade cadastrada. Adicione atividades na aba Atividades.</div>;

  const handleNota = (alunoId: string, atvId: string, val: string) => {
    const n = val === '' ? null : Math.min(10, Math.max(0, parseFloat(val)));
    if (val !== '' && isNaN(n as number)) return;
    setNota(disc.id, alunoId, atvId, n);
  };

  const gruposByMedia = (['M1', 'M2', 'M3'] as MediaGrupo[]).reduce((acc, m) => {
    acc[m] = atvs.filter((a) => a.media === m);
    return acc;
  }, {} as Record<MediaGrupo, typeof atvs>);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            <th className="text-left px-3 py-2.5 font-medium text-muted-foreground border-b bg-muted/30 sticky left-0 z-10 min-w-[160px]">Aluno</th>
            {(['M1', 'M2', 'M3'] as MediaGrupo[]).map((m) =>
              gruposByMedia[m].length > 0 ? (
                <React.Fragment key={m}>
                  {gruposByMedia[m].map((a) => (
                    <th key={a.id} className="px-2 py-2.5 border-b border-l bg-muted/30 min-w-[90px]">
                      <div className="text-xs font-semibold text-center leading-tight">
                        {a.nome}
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1 rounded">{a.tipo}</span>
                        <span className="text-[10px] text-muted-foreground">&times;{a.peso}</span>
                      </div>
                    </th>
                  ))}
                  <th className="px-2 py-2.5 border-b border-l bg-indigo-50 dark:bg-indigo-950/30 min-w-[80px]">
                    <div className="text-xs font-bold text-center text-indigo-600 dark:text-indigo-400">{m}</div>
                  </th>
                </React.Fragment>
              ) : null
            )}
            <th className="px-3 py-2.5 border-b border-l bg-slate-100 dark:bg-slate-800/50 min-w-[90px]">
              <div className="text-xs font-bold text-center">Média Final</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((al, i) => {
            const notas = disc.notas[al.id] || {};
            return (
              <tr key={al.id} className={cn('hover:bg-muted/20 transition-colors', i % 2 === 0 ? '' : 'bg-muted/10')}>
                <td className="px-3 py-2 border-b sticky left-0 bg-background z-10">
                  <div className="flex items-center gap-2">
                    <UserAvatar initials={al.initials} size="sm" />
                    <span className="font-medium text-xs truncate max-w-[120px]" title={al.nome}>{al.nome}</span>
                  </div>
                </td>
                {(['M1', 'M2', 'M3'] as MediaGrupo[]).map((m) =>
                  gruposByMedia[m].length > 0 ? (
                    <React.Fragment key={m}>
                      {gruposByMedia[m].map((a) => {
                        const v = notas[a.id];
                        const displayVal = v !== null && v !== undefined ? v.toString() : '';
                        return (
                          <td key={a.id} className="px-1.5 py-1.5 border-b border-l text-center">
                            <input
                              type="number"
                              defaultValue={displayVal}
                              min={0} max={10} step={0.5}
                              onBlur={(e) => handleNota(al.id, a.id, e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
                              placeholder="—"
                              aria-label={`Nota de ${al.nome} em ${a.nome}`}
                              className={cn(
                                'w-16 h-8 text-center text-sm font-mono rounded border bg-transparent',
                                'border-border focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400/50',
                                'placeholder:text-muted-foreground/40 transition-colors',
                                v !== null && v !== undefined ? notaBg(v) : ''
                              )}
                            />
                          </td>
                        );
                      })}
                      <td className="px-2 py-2 border-b border-l bg-indigo-50/50 dark:bg-indigo-950/20 text-center">
                        <span className={cn('text-sm font-bold tabular-nums', notaColor(calcMedia(disc.id, al.id, m)))}>
                          {formatNota(calcMedia(disc.id, al.id, m))}
                        </span>
                      </td>
                    </React.Fragment>
                  ) : null
                )}
                <td className="px-2 py-2 border-b border-l bg-slate-50 dark:bg-slate-800/30 text-center">
                  {(() => {
                    const mf = (['M1','M2','M3'] as MediaGrupo[]).map(m => calcMedia(disc.id, al.id, m)).filter(v => v !== null) as number[];
                    const media = mf.length ? Math.round(mf.reduce((a,b)=>a+b,0)/mf.length*10)/10 : null;
                    return (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className={cn('text-sm font-bold tabular-nums', notaColor(media))}>{formatNota(media)}</span>
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', situacaoBadge(media))}>{situacao(media)}</span>
                      </div>
                    );
                  })()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
