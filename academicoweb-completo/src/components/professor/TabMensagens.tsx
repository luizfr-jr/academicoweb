import { useStore } from '@/store';
import type { Disciplina } from '@/types';
import { UserAvatar } from '@/components/UserAvatar';
import { cn } from '@/lib/utils';

export function TabMensagens({ disc }: { disc: Disciplina }) {
  const { getMensagensDaDisciplina, markMensagemLida, usuarios } = useStore();
  const msgs = getMensagensDaDisciplina(disc.id);

  if (!msgs.length) return <div className="text-center py-8 text-muted-foreground text-sm">Nenhuma mensagem recebida nesta disciplina.</div>;

  return (
    <div className="space-y-3">
      {msgs.map((m) => {
        const aluno = usuarios.find((u) => u.id === m.alunoId);
        return (
          <div key={m.id} onClick={() => markMensagemLida(m.id)}
            className={cn('p-4 rounded-lg border cursor-pointer transition-colors',
              m.lida ? 'border-border bg-muted/10' : 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/20')}>
            <div className="flex items-start gap-3">
              {aluno && <UserAvatar initials={aluno.initials} size="sm" />}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{m.assunto}</span>
                  {!m.lida && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{aluno?.nome} · {m.data}</div>
                <div className="text-sm mt-2 text-muted-foreground leading-relaxed">{m.msg}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
