import { useState } from 'react';
import { useStore } from '@/store';
import type { Atividade, MediaGrupo } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { TIPOS_ATIVIDADE } from '@/lib/utils-app';

export function AtividadeModal({ open, onClose, discId, editing }: { open: boolean; onClose: () => void; discId: string; editing?: Atividade }) {
  const { addAtividade, updateAtividade } = useStore();
  const [form, setForm] = useState({
    nome: editing?.nome || '',
    tipo: editing?.tipo || 'AV1',
    data: editing?.data || new Date().toISOString().split('T')[0],
    peso: editing?.peso?.toString() || '1.0',
    media: (editing?.media || 'M1') as MediaGrupo,
    descricao: editing?.descricao || '',
  });

  const save = () => {
    if (!form.nome.trim()) return;
    const data = { ...form, peso: parseFloat(form.peso) || 1.0 };
    if (editing) updateAtividade(discId, editing.id, data);
    else addAtividade(discId, data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? 'Editar Atividade' : 'Nova Atividade'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs mb-1 block">Nome da Atividade</Label>
            <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Prova 1, Trabalho Prático..." />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs mb-1 block">Tipo / Código</Label>
              <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TIPOS_ATIVIDADE.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs mb-1 block">Data</Label>
              <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Peso</Label>
              <Input type="number" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })}
                step="0.5" min="0.5" max="10" />
            </div>
          </div>

          <div>
            <Label className="text-xs mb-1 block">Compõe</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['M1', 'M2', 'M3'] as MediaGrupo[]).map((m) => (
                <button key={m} onClick={() => setForm({ ...form, media: m })}
                  className={cn('py-2 rounded-lg border text-sm font-semibold transition-all',
                    form.media === m ? 'bg-indigo-600 text-white border-indigo-600' : 'border-border hover:border-indigo-400 text-muted-foreground')}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs mb-1 block">Descrição (opcional)</Label>
            <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Detalhes da atividade..." />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={save}>{editing ? 'Salvar' : 'Criar Atividade'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
