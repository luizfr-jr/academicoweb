import { useState } from 'react';
import { useStore } from '@/store';
import { DiscCard } from '@/components/DiscCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { DiscDetalheAluno } from './DiscDetalheAluno';
import { ChatModal } from './ChatModal';

export function AlunoView() {
  const { currentUser, getDisciplinasDoAluno, calcMediaFinal } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [busca, setBusca] = useState('');

  if (!currentUser) return null;

  const discs = getDisciplinasDoAluno(currentUser.id);
  const selected = discs.find((d) => d.id === selectedId);

  if (selected) {
    return <DiscDetalheAluno disc={selected} onBack={() => setSelectedId(null)} />;
  }

  const filtradas = busca.trim()
    ? discs.filter((d) =>
        d.nome.toLowerCase().includes(busca.toLowerCase()) ||
        d.codigo.toLowerCase().includes(busca.toLowerCase())
      )
    : discs;

  const ativas = filtradas.filter((d) => d.periodo.startsWith('2025') || d.periodo.startsWith('2026'));
  const concluidas = filtradas.filter((d) => !d.periodo.startsWith('2025') && !d.periodo.startsWith('2026'));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold">Olá, {currentUser.nome.split(' ')[0]}!</h2>
          <p className="text-sm text-muted-foreground">{discs.length} disciplina(s) no total</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowChat(true)}>Enviar dúvida</Button>
      </div>

      {discs.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou código..."
            className="pl-9 pr-9"
            aria-label="Buscar disciplinas"
          />
          {busca && (
            <button onClick={() => setBusca('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Limpar busca">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {discs.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-4xl mb-3">📋</div>
          <p className="font-medium">Nenhuma disciplina matriculada</p>
        </div>
      )}

      {ativas.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Em andamento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ativas.map((d) => (
              <DiscCard
                key={d.id}
                disciplina={d}
                mediaGeral={calcMediaFinal(d.id, currentUser.id)}
                onClick={() => setSelectedId(d.id)}
                role="aluno"
              />
            ))}
          </div>
        </div>
      )}

      {concluidas.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Concluídas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {concluidas.map((d) => (
              <DiscCard
                key={d.id}
                disciplina={d}
                mediaGeral={calcMediaFinal(d.id, currentUser.id)}
                onClick={() => setSelectedId(d.id)}
                role="aluno"
              />
            ))}
          </div>
        </div>
      )}

      {showChat && discs.length > 0 && (
        <ChatModal open discId={discs[0].id} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
}
