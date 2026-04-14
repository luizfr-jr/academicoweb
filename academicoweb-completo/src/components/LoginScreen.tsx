import { useState } from 'react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

export function LoginScreen() {
  const { login, error: storeError, loading } = useStore();
  const [role, setRole] = useState<'professor' | 'aluno'>('professor');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    await login(email, senha, role);
  };

  const demoAccess = (e: string, s: string, r: 'professor' | 'aluno') => {
    setEmail(e); setSenha(s); setRole(r);
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center p-4">
      <div className="fixed inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-4 shadow-lg shadow-indigo-500/25">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AcadêmicoWeb</h1>
          <p className="text-sm text-slate-500 mt-1">Sistema de Gestão de Notas — UFN</p>
        </div>
        <Card className="border-slate-800 bg-[#0f1117]/80 backdrop-blur shadow-2xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-slate-900 rounded-lg">
              {(['professor', 'aluno'] as const).map((r) => (
                <button key={r} onClick={() => setRole(r)}
                  className={`py-2 rounded-md text-sm font-medium transition-all ${role === r ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>
                  {r === 'professor' ? '👨‍🏫 Professor' : '👨‍🎓 Aluno'}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-400 text-xs font-medium mb-1.5 block">E-mail</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
              </div>
              <div>
                <Label className="text-slate-400 text-xs font-medium mb-1.5 block">Senha</Label>
                <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
              </div>
              {storeError && (
                <p className="text-red-400 text-xs bg-red-950/50 border border-red-900 rounded-md px-3 py-2">{storeError}</p>
              )}
              <Button onClick={handleLogin} disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-10">
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
            <div className="mt-5 pt-5 border-t border-slate-800">
              <p className="text-xs text-slate-600 mb-2 font-medium uppercase tracking-wider">Acesso rápido (demo)</p>
              <div className="space-y-1.5">
                <button onClick={() => demoAccess('prof@ufn.edu.br', '123', 'professor')}
                  className="w-full text-left px-3 py-2 rounded-md bg-slate-900 hover:bg-slate-800 transition text-xs">
                  <span className="text-indigo-400 font-medium">Professor</span>
                  <span className="text-slate-500 ml-2">prof@ufn.edu.br / 123</span>
                </button>
                <button onClick={() => demoAccess('joao@email.com', '123', 'aluno')}
                  className="w-full text-left px-3 py-2 rounded-md bg-slate-900 hover:bg-slate-800 transition text-xs">
                  <span className="text-violet-400 font-medium">Aluno João</span>
                  <span className="text-slate-500 ml-2">joao@email.com / 123</span>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
