import { useState } from 'react';
import { useStore } from '@/store';
import { LoginScreen } from './LoginScreen';
import { ProfessorView } from './professor/ProfessorView';
import { AlunoView } from './aluno/AlunoView';
import { UserAvatar } from './UserAvatar';
import { ThemeToggle } from './ThemeToggle';
import { ChangePasswordModal } from './ChangePasswordModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function Topbar({ onChangePassword }: { onChangePassword: () => void }) {
  const { currentUser, logout, getUnreadCount } = useStore();
  if (!currentUser) return null;
  const unread = currentUser.role === 'professor' ? getUnreadCount() : 0;

  return (
    <header className="h-14 border-b bg-card/80 backdrop-blur sticky top-0 z-50 flex items-center px-4 gap-4" role="banner">
      <nav aria-label="Menu principal" className="flex items-center gap-2">
        <span className="text-xl">🎓</span>
        <span className="font-bold text-sm tracking-tight hidden sm:block">AcadêmicoWeb</span>
        <span className="text-xs text-muted-foreground hidden sm:block">· UFN</span>
      </nav>
      <div className="flex-1" />
      {unread > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-full" role="status">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          {unread} mensagem(ns) não lida(s)
        </div>
      )}
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 hover:bg-muted rounded-lg px-2 py-1.5 transition-colors" aria-label={`Menu do usuário: ${currentUser.nome}`}>
            <UserAvatar initials={currentUser.initials} size="sm" />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold leading-tight">{currentUser.nome}</div>
              <div className="text-[10px] text-muted-foreground capitalize">{currentUser.role}</div>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs">{currentUser.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs cursor-pointer" onClick={onChangePassword}>
            Alterar Senha
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs cursor-pointer text-destructive focus:text-destructive"
            onClick={logout}
          >
            Sair da conta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

function LoadingOverlay() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="text-3xl animate-spin inline-block">⚙️</div>
        <p className="text-sm text-muted-foreground">Carregando dados...</p>
      </div>
    </div>
  );
}

export function AppShell() {
  const { currentUser, loading } = useStore();
  const [showChangePassword, setShowChangePassword] = useState(false);

  if (!currentUser) return <LoginScreen />;
  if (loading) return <LoadingOverlay />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-background focus:border focus:rounded-md focus:text-sm">
        Pular para o conteúdo
      </a>
      <Topbar onChangePassword={() => setShowChangePassword(true)} />
      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {currentUser.role === 'professor' ? <ProfessorView /> : <AlunoView />}
      </main>
      {showChangePassword && <ChangePasswordModal open onClose={() => setShowChangePassword(false)} />}
    </div>
  );
}
