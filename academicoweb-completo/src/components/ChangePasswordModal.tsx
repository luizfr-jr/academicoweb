import { useState } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { changePassword } = useStore();
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!form.current || !form.newPass || !form.confirm) {
      setError('Preencha todos os campos.');
      return;
    }
    if (form.newPass.length < 3) {
      setError('A nova senha deve ter pelo menos 3 caracteres.');
      return;
    }
    if (form.newPass !== form.confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    const ok = await changePassword(form.current, form.newPass);
    setLoading(false);

    if (ok) {
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setForm({ current: '', newPass: '', confirm: '' }); onClose(); }, 1500);
    } else {
      setError('Senha atual incorreta.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Alterar Senha</DialogTitle></DialogHeader>
        {success ? (
          <div className="text-center py-6 text-emerald-500 font-medium">Senha alterada com sucesso!</div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label className="text-xs mb-1 block">Senha atual</Label>
              <Input type="password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Nova senha</Label>
              <Input type="password" value={form.newPass} onChange={(e) => setForm({ ...form, newPass: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs mb-1 block">Confirmar nova senha</Label>
              <Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} />
            </div>
            {error && <p className="text-red-500 text-xs" role="alert">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Salvando...' : 'Alterar Senha'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
