import { useState } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function AlunoModal({ open, onClose, discId }: { open: boolean; onClose: () => void; discId: string }) {
  const { addAlunoToDisciplina } = useStore();
  const [form, setForm] = useState({ nome: '', email: '', senha: '123' });
  const [success, setSuccess] = useState('');

  const save = () => {
    if (!form.nome.trim() || !form.email.trim()) return;
    addAlunoToDisciplina(discId, { nome: form.nome, email: form.email, senha: form.senha });
    setSuccess(`${form.nome} adicionado(a) com sucesso!`);
    setForm({ nome: '', email: '', senha: '123' });
    setTimeout(() => { setSuccess(''); onClose(); }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Adicionar Aluno</DialogTitle></DialogHeader>
        {success ? (
          <div className="text-center py-6 text-emerald-500 font-medium">{success}</div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label className="text-xs mb-1 block">Nome completo</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="João da Silva" />
            </div>
            <div>
              <Label className="text-xs mb-1 block">E-mail (login)</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="joao@email.com" />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Senha inicial</Label>
              <Input type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button onClick={save}>Adicionar</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
