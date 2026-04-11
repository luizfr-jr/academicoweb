import { useState } from 'react';
import { useStore } from '@/store';
import type { Disciplina, Atividade, MediaGrupo } from '@/types';
import { Button } from '@/components/ui/button';
import { AtividadeModal } from './AtividadeModal';

export function TabAtividades({ disc, onNew }: { disc: Disciplina; onNew: () => void }) {
  const { removeAtividade } = useStore();
  const [editing, setEditing] = useState<Atividade | undefined>();

  const groups: Record<MediaGrupo, Atividade[]> = { M1: [], M2: [], M3: [] };
  disc.atividades.forEach((a) => groups[a.media].push(a));

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={onNew}>+ Nova Atividade</Button>
      </div>
      {disc.atividades.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">Nenhuma atividade cadastrada.</div>
      )}
      {(['M1', 'M2', 'M3'] as MediaGrupo[]).map((m) =>
        groups[m].length > 0 ? (
          <div key={m}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{m}</span>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">
                {groups[m].length} atividade(s) · Pesos: {groups[m].reduce((s, a) => s + a.peso, 0).toFixed(1)}
              </span>
            </div>
            <div className="space-y-2">
              {groups[m].map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{a.nome}</span>
                      <span className="text-xs font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded">{a.tipo}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex gap-3">
                      <span>{a.data}</span>
                      <span>Peso: {a.peso}</span>
                      {a.descricao && <span>· {a.descricao}</span>}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(a)} className="text-xs">Editar</Button>
                  <Button size="sm" variant="ghost" onClick={() => removeAtividade(disc.id, a.id)} className="text-xs text-destructive hover:text-destructive">Remover</Button>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}
      {editing && (
        <AtividadeModal open={!!editing} onClose={() => setEditing(undefined)} discId={disc.id} editing={editing} />
      )}
    </div>
  );
}
