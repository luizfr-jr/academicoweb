import { useState } from 'react';
import { useStore } from '@/store';
import type { Disciplina, MediaGrupo } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatNota, notaColor, notaBg, situacao, situacaoBadge } from '@/lib/utils-app';
import { ChatModal } from './ChatModal';

export function DiscDetalheAluno({ disc, onBack }: { disc: Disciplina; onBack: () => void }) {
  const { currentUser, calcMedia } = useStore();
  const [showChat, setShowChat] = useState(false);
  if (!currentUser) return null;

  const alunoId = currentUser.id;
  const notas = disc.notas[alunoId] || {};
  const grupos: Record<MediaGrupo, typeof disc.atividades> = { M1: [], M2: [], M3: [] };
  disc.atividades.forEach((a) => grupos[a.media].push(a));

  const medias = (['M1','M2','M3'] as MediaGrupo[]).map((m) => ({
    m, valor: calcMedia(disc.id, alunoId, m),
    atvs: grupos[m],
  }));

  const mediasComValor = medias.map(x => x.valor).filter((v): v is number => v !== null);
  const mediaFinal = mediasComValor.length
    ? Math.round(mediasComValor.reduce((a,b)=>a+b,0)/mediasComValor.length*10)/10
    : null;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        &larr; Voltar às disciplinas
      </button>

      <div className="flex items-start gap-4">
        <span className="text-4xl">{disc.emoji}</span>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{disc.nome}</h2>
          <p className="text-muted-foreground text-sm">{disc.codigo} · {disc.periodo}</p>
          {disc.descricao && <p className="text-sm text-muted-foreground mt-1">{disc.descricao}</p>}
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowChat(true)}>Enviar dúvida</Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {medias.map(({ m, valor }) => (
          <div key={m} className="rounded-xl border p-4 text-center bg-card">
            <div className="text-xs text-muted-foreground font-medium mb-1">{m}</div>
            <div className={cn('text-2xl font-bold tabular-nums', valor !== null ? notaColor(valor) : 'text-muted-foreground')}>
              {formatNota(valor)}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{grupos[m].length} ativ.</div>
          </div>
        ))}
        <div className={cn('rounded-xl border p-4 text-center', mediaFinal !== null && mediaFinal >= 7 ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800' : mediaFinal !== null && mediaFinal >= 5 ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' : 'bg-card')}>
          <div className="text-xs text-muted-foreground font-medium mb-1">Média Final</div>
          <div className={cn('text-2xl font-bold tabular-nums', notaColor(mediaFinal))}>
            {formatNota(mediaFinal)}
          </div>
          <div className={cn('text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block', situacaoBadge(mediaFinal))}>
            {situacao(mediaFinal)}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {medias.map(({ m, valor, atvs }) => {
          if (!atvs.length) return null;
          return (
            <div key={m} className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{m}</span>
                  <span className="text-xs text-muted-foreground">{atvs.length} atividade(s)</span>
                </div>
                <span className={cn('text-sm font-bold tabular-nums', notaColor(valor))}>
                  Média: {formatNota(valor)}
                </span>
              </div>
              <div className="divide-y">
                {atvs.map((a) => {
                  const v = notas[a.id] !== undefined ? notas[a.id] : null;
                  const hasNota = v !== null && v !== undefined;
                  return (
                    <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{a.nome}</span>
                          <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{a.tipo}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex gap-3">
                          <span>{a.data}</span>
                          <span>Peso {a.peso}</span>
                        </div>
                      </div>
                      <div className={cn('min-w-[52px] h-10 flex items-center justify-center rounded-lg text-base font-bold tabular-nums',
                        hasNota ? notaBg(v as number) : 'bg-muted text-muted-foreground')}>
                        {hasNota ? (v as number).toFixed(1) : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
              {valor !== null && (
                <div className="px-4 py-2 bg-muted/20 border-t">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', valor >= 7 ? 'bg-emerald-500' : valor >= 5 ? 'bg-amber-500' : 'bg-red-500')}
                        style={{ width: `${Math.min(100, (valor / 10) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">{(valor / 10 * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {disc.atividades.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">Nenhuma atividade cadastrada nesta disciplina.</div>
      )}

      {showChat && <ChatModal open discId={disc.id} onClose={() => setShowChat(false)} />}
    </div>
  );
}
