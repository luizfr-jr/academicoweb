import { useState } from 'react';
import { useStore } from '@/store';
import type { Disciplina } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { EMOJIS_SUGERIDOS, CORES_DISPONIVEIS, PERIODOS, COR_MAP } from '@/lib/utils-app';

export function DisciplinaModal({ open, onClose, editing }: { open: boolean; onClose: () => void; editing?: Disciplina }) {
  const { addDisciplina, updateDisciplina } = useStore();
  const [form, setForm] = useState({
    nome: editing?.nome || '',
    codigo: editing?.codigo || '',
    emoji: editing?.emoji || '📚',
    periodo: editing?.periodo || '2025/1',
    descricao: editing?.descricao || '',
    cor: editing?.cor || 'blue',
  });

  const save = () => {
    if (!form.nome.trim()) return;
    if (editing) updateDisciplina(editing.id, form);
    else addDisciplina(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar Disciplina' : 'Nova Disciplina'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs mb-1 block">Emoji</Label>
              <Input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} maxLength={2} className="text-2xl text-center" />
              <div className="flex flex-wrap gap-1 mt-1">
                {EMOJIS_SUGERIDOS.slice(0, 10).map((e) => (
                  <button key={e} onClick={() => setForm({ ...form, emoji: e })} className="text-lg hover:scale-125 transition-transform">{e}</button>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <Label className="text-xs mb-1 block">Código</Label>
              <Input value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} placeholder="BD301" />
            </div>
          </div>

          <div>
            <Label className="text-xs mb-1 block">Nome da Disciplina</Label>
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Banco de Dados" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs mb-1 block">Período</Label>
              <Select value={form.periodo} onValueChange={(v) => setForm({ ...form, periodo: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{PERIODOS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1 block">Cor do cartão</Label>
              <div className="flex gap-2 mt-1">
                {CORES_DISPONIVEIS.map((c) => (
                  <button key={c} onClick={() => setForm({ ...form, cor: c })}
                    className={cn('w-7 h-7 rounded-full transition-all', COR_MAP[c].dot,
                      form.cor === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-60 hover:opacity-100')} />
                ))}
              </div>
            </div>
          </div>

          <div>
            <Label className="text-xs mb-1 block">Descrição da disciplina</Label>
            <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Breve descrição do conteúdo e objetivos da disciplina..." rows={3} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={save}>{editing ? 'Salvar' : 'Criar Disciplina'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
