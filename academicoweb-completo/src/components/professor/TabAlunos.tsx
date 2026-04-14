import { useStore } from '@/store';
import type { Disciplina, MediaGrupo } from '@/types';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatNota, notaColor, situacao, situacaoBadge } from '@/lib/utils-app';

export function TabAlunos({ disc, onNew }: { disc: Disciplina; onNew: () => void }) {
  const { getAlunosDaDisciplina, removeAlunoFromDisciplina, calcMedia, calcMediaFinal } = useStore();
  const alunos = getAlunosDaDisciplina(disc.id);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{alunos.length} aluno(s) matriculado(s)</span>
        <Button size="sm" onClick={onNew}>+ Adicionar Aluno</Button>
      </div>
      {alunos.length === 0 && <div className="text-center py-8 text-muted-foreground text-sm">Nenhum aluno matriculado.</div>}
      <div className="space-y-2">
        {alunos.map((al) => {
          const mf = calcMediaFinal(disc.id, al.id);
          return (
            <div key={al.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/20 transition-colors">
              <UserAvatar initials={al.initials} />
              <div className="flex-1">
                <div className="font-medium text-sm">{al.nome}</div>
                <div className="text-xs text-muted-foreground">{al.email}</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {(['M1','M2','M3'] as MediaGrupo[]).map((m) => (
                  <span key={m} className={cn('font-mono', notaColor(calcMedia(disc.id, al.id, m)))}>
                    {m}: {formatNota(calcMedia(disc.id, al.id, m))}
                  </span>
                ))}
              </div>
              <div className="text-right min-w-[60px]">
                <span className={cn('text-sm font-bold tabular-nums', notaColor(mf))}>{formatNota(mf)}</span>
                <div className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-0.5', situacaoBadge(mf))}>{situacao(mf)}</div>
              </div>
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive text-xs"
                onClick={() => removeAlunoFromDisciplina(disc.id, al.id)}>Remover</Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
