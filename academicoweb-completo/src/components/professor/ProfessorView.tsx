import { useState } from 'react';
import { useStore } from '@/store';
import { DiscCard } from '@/components/DiscCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { DisciplinaModal } from './DisciplinaModal';
import { DiscDetalhe } from './DiscDetalhe';

export function ProfessorView() {
  const { disciplinas } = useStore();
  const [showNew, setShowNew] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  const selected = disciplinas.find((d) => d.id === selectedId);

  if (selected) {
    return <DiscDetalhe disc={selected} onBack={() => setSelectedId(null)} />;
  }

  const filtradas = busca.trim()
    ? disciplinas.filter((d) =>
        d.nome.toLowerCase().includes(busca.toLowerCase()) ||
        d.codigo.toLowerCase().includes(busca.toLowerCase()) ||
        d.periodo.includes(busca)
      )
    : disciplinas;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold">Minhas Disciplinas</h2>
          <p className="text-sm text-muted-foreground">{disciplinas.length} disciplinas cadastradas</p>
        </div>
        <Button onClick={() => setShowNew(true)}>+ Nova Disciplina</Button>
      </div>

      {disciplinas.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, código ou período..."
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

      {disciplinas.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-4xl mb-3">📚</div>
          <p className="font-medium">Nenhuma disciplina cadastrada</p>
          <p className="text-sm mt-1">Crie sua primeira disciplina para começar.</p>
        </div>
      )}

      {disciplinas.length > 0 && filtradas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Nenhuma disciplina encontrada para "{busca}".
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtradas.map((d) => (
          <DiscCard
            key={d.id}
            disciplina={d}
            alunosCount={d.alunos.length}
            atividadesCount={d.atividades.length}
            onClick={() => setSelectedId(d.id)}
            role="professor"
          />
        ))}
      </div>

      {showNew && <DisciplinaModal open onClose={() => setShowNew(false)} />}
    </div>
  );
}
