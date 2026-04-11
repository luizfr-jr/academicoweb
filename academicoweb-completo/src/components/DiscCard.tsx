import type { Disciplina } from '@/types';
import { COR_MAP, formatNota, isAtivo, isConcluido } from '@/lib/utils-app';
import { cn } from '@/lib/utils';

interface DiscCardProps {
  disciplina: Disciplina;
  mediaGeral?: number | null;
  alunosCount?: number;
  atividadesCount?: number;
  onClick: () => void;
  role: 'professor' | 'aluno';
}

export function DiscCard({ disciplina: d, mediaGeral, alunosCount, atividadesCount, onClick, role }: DiscCardProps) {
  const cor = COR_MAP[d.cor] || COR_MAP.blue;
  const ativo = isAtivo(d.periodo);
  const concluido = isConcluido(d.periodo);

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative rounded-xl border bg-card p-5 cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-400/50',
        'flex flex-col gap-3'
      )}
    >
      {/* Top accent bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity', cor.dot.replace('bg-', 'bg-'))} />

      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none flex-shrink-0">{d.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight truncate">{d.nome}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{d.codigo}</p>
        </div>
      </div>

      {/* Description */}
      {d.descricao && (
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{d.descricao}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', cor.bg, cor.text, cor.border, 'border')}>
            <span className={cn('w-1.5 h-1.5 rounded-full', cor.dot)} />
            {d.periodo}
          </span>
          {ativo && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">● Ativo</span>
          )}
          {concluido && !ativo && (
            <span className="text-xs text-muted-foreground">Concluída</span>
          )}
        </div>

        {role === 'professor' && (
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span>{alunosCount ?? 0} alunos</span>
            <span>{atividadesCount ?? 0} ativ.</span>
          </div>
        )}

        {role === 'aluno' && mediaGeral !== undefined && (
          <span className={cn(
            'text-sm font-bold tabular-nums',
            mediaGeral === null ? 'text-muted-foreground' :
            mediaGeral >= 7 ? 'text-emerald-600 dark:text-emerald-400' :
            mediaGeral >= 5 ? 'text-amber-600 dark:text-amber-400' :
            'text-red-600 dark:text-red-400'
          )}>
            {formatNota(mediaGeral)}
          </span>
        )}
      </div>
    </div>
  );
}
