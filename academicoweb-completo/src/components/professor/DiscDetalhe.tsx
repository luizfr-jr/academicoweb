import { useState } from 'react';
import { useStore } from '@/store';
import type { Disciplina, MediaGrupo } from '@/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { formatNota, notaColor } from '@/lib/utils-app';
import { exportGradesToCSV } from '@/lib/export';
import { Download } from 'lucide-react';
import { DisciplinaModal } from './DisciplinaModal';
import { AtividadeModal } from './AtividadeModal';
import { AlunoModal } from './AlunoModal';
import { TabNotas } from './TabNotas';
import { TabAtividades } from './TabAtividades';
import { TabAlunos } from './TabAlunos';
import { TabMensagens } from './TabMensagens';

export function DiscDetalhe({ disc, onBack }: { disc: Disciplina; onBack: () => void }) {
  const { calcMedia, calcMediaFinal, getAlunosDaDisciplina, getUnreadCount, removeDisciplina } = useStore();
  const [showNewAtv, setShowNewAtv] = useState(false);
  const [showNewAluno, setShowNewAluno] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const alunos = getAlunosDaDisciplina(disc.id);
  const unread = getUnreadCount(disc.id);

  const mediasSummary = (['M1','M2','M3'] as MediaGrupo[]).map((m) => {
    const vals = alunos.map((al) => calcMedia(disc.id, al.id, m)).filter((v): v is number => v !== null);
    const avg = vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length*10)/10 : null;
    return { m, avg };
  });

  return (
    <div className="space-y-5">
      <div>
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
          &larr; Voltar às disciplinas
        </button>
        <div className="flex items-start gap-4">
          <span className="text-4xl">{disc.emoji}</span>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{disc.nome}</h2>
            <p className="text-muted-foreground text-sm">{disc.codigo} · {disc.periodo} · {alunos.length} alunos</p>
            {disc.descricao && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{disc.descricao}</p>}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => exportGradesToCSV(disc, alunos, calcMedia, calcMediaFinal)} aria-label="Exportar notas em CSV">
              <Download className="h-4 w-4 mr-1" /> CSV
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowEdit(true)}>Editar</Button>
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive"
              onClick={() => { if (confirm('Excluir disciplina?')) { removeDisciplina(disc.id); onBack(); } }}>
              Excluir
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {mediasSummary.map(({ m, avg }) => (
          <div key={m} className="rounded-xl border p-4 text-center bg-card">
            <div className="text-xs text-muted-foreground font-medium mb-1">{m} — Turma</div>
            <div className={cn('text-2xl font-bold tabular-nums', avg !== null ? notaColor(avg) : 'text-muted-foreground')}>
              {formatNota(avg)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {disc.atividades.filter(a => a.media === m).length} atividade(s)
            </div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="notas">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notas">Notas</TabsTrigger>
          <TabsTrigger value="atividades">Atividades</TabsTrigger>
          <TabsTrigger value="alunos">Alunos</TabsTrigger>
          <TabsTrigger value="mensagens" className="relative">
            Mensagens
            {unread > 0 && <span className="ml-1 text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">{unread}</span>}
          </TabsTrigger>
        </TabsList>
        <div className="mt-4 rounded-xl border p-4 bg-card">
          <TabsContent value="notas" className="m-0"><TabNotas disc={disc} /></TabsContent>
          <TabsContent value="atividades" className="m-0">
            <TabAtividades disc={disc} onNew={() => setShowNewAtv(true)} />
          </TabsContent>
          <TabsContent value="alunos" className="m-0">
            <TabAlunos disc={disc} onNew={() => setShowNewAluno(true)} />
          </TabsContent>
          <TabsContent value="mensagens" className="m-0"><TabMensagens disc={disc} /></TabsContent>
        </div>
      </Tabs>

      {showEdit && <DisciplinaModal open editing={disc} onClose={() => setShowEdit(false)} />}
      {showNewAtv && <AtividadeModal open discId={disc.id} onClose={() => setShowNewAtv(false)} />}
      {showNewAluno && <AlunoModal open discId={disc.id} onClose={() => setShowNewAluno(false)} />}
    </div>
  );
}
