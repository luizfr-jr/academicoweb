import { useState } from 'react';
import { useStore } from '@/store';
import type { Disciplina } from '@/types';
import { UserAvatar } from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function TabMensagens({ disc }: { disc: Disciplina }) {
  const { getMensagensDaDisciplina, markMensagemLida, replyMensagem, usuarios } = useStore();
  const msgs = getMensagensDaDisciplina(disc.id);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  if (!msgs.length) return <div className="text-center py-8 text-muted-foreground text-sm">Nenhuma mensagem recebida nesta disciplina.</div>;

  const handleReply = async (msgId: string) => {
    if (!replyText.trim()) return;
    setSending(true);
    await replyMensagem(msgId, replyText.trim());
    setSending(false);
    setReplyingTo(null);
    setReplyText('');
  };

  const openReply = (msgId: string, current?: string) => {
    setReplyingTo(msgId);
    setReplyText(current || '');
    markMensagemLida(msgId);
  };

  return (
    <div className="space-y-3">
      {msgs.map((m) => {
        const aluno = usuarios.find((u) => u.id === m.alunoId);
        const isReplying = replyingTo === m.id;
        return (
          <div key={m.id}
            className={cn('rounded-lg border transition-colors',
              m.lida ? 'border-border bg-muted/10' : 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/20')}>
            <div className="p-4 cursor-pointer" onClick={() => !isReplying && markMensagemLida(m.id)}>
              <div className="flex items-start gap-3">
                {aluno && <UserAvatar initials={aluno.initials} size="sm" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{m.assunto}</span>
                    {!m.lida && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                    {m.resposta && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-medium">
                        Respondida
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{aluno?.nome} · {m.data}</div>
                  <div className="text-sm mt-2 text-muted-foreground leading-relaxed">{m.msg}</div>

                  {m.resposta && !isReplying && (
                    <div className="mt-3 pl-3 border-l-2 border-indigo-300 dark:border-indigo-600">
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                        Sua resposta · {m.respondidaEm}
                      </div>
                      <div className="text-sm text-foreground leading-relaxed">{m.resposta}</div>
                    </div>
                  )}
                </div>
                <Button size="sm" variant="outline" className="shrink-0 text-xs"
                  onClick={(e) => { e.stopPropagation(); openReply(m.id, m.resposta); }}>
                  {m.resposta ? 'Editar resposta' : 'Responder'}
                </Button>
              </div>
            </div>

            {isReplying && (
              <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escreva sua resposta ao aluno..."
                  rows={3}
                  className="text-sm"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => { setReplyingTo(null); setReplyText(''); }}>
                    Cancelar
                  </Button>
                  <Button size="sm" disabled={!replyText.trim() || sending} onClick={() => handleReply(m.id)}>
                    {sending ? 'Enviando...' : 'Enviar resposta'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
