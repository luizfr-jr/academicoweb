import { useState } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function ChatModal({ open, onClose, discId }: { open: boolean; onClose: () => void; discId: string }) {
  const { addMensagem, currentUser, disciplinas } = useStore();
  const [form, setForm] = useState({ assunto: '', msg: '' });
  const [sent, setSent] = useState(false);
  const [chosenDisc, setChosenDisc] = useState(discId);

  const send = () => {
    if (!form.assunto.trim() || !form.msg.trim() || !currentUser) return;
    addMensagem({ discId: chosenDisc, alunoId: currentUser.id, assunto: form.assunto, msg: form.msg });
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ assunto: '', msg: '' }); onClose(); }, 1800);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Enviar dúvida ao professor</DialogTitle></DialogHeader>
        {sent ? (
          <div className="text-center py-8">
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">Mensagem enviada com sucesso!</p>
            <p className="text-sm text-muted-foreground mt-1">O professor receberá sua dúvida em breve.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label className="text-xs mb-1 block">Disciplina</Label>
              <Select value={chosenDisc} onValueChange={setChosenDisc}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {disciplinas.map((d) => <SelectItem key={d.id} value={d.id}>{d.emoji} {d.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1 block">Assunto</Label>
              <Input value={form.assunto} onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                placeholder="Dúvida sobre prova, prazo de entrega..." />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Mensagem</Label>
              <Textarea value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })}
                placeholder="Descreva sua dúvida com detalhes..." rows={4} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button onClick={send}>Enviar Mensagem</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
