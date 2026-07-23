import { Code2 } from 'lucide-react';

import { CodeExample } from '../compiler/examples';
import { HeaderControls } from './HeaderControls';

interface HeaderProps {
  isRunning: boolean;
  isPaused: boolean;
  onRun: () => void;
  onStop: () => void;
  onStep: () => void;
  onSelectExample: (example: CodeExample) => void;
  onOpenPlan: () => void;
  onSavePcode: () => void;
  onOpenPcode: (file: File) => void;
  stepDelay: number;
  setStepDelay: (delay: number) => void;
}

export const Header = (props: HeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/95 px-4 py-2.5 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
          <Code2 className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              ts-pseudo
            </h1>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Español
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Compilador y Entorno de Aprendizaje de Pseudocódigo para Niños
          </p>
        </div>
      </div>

      <HeaderControls {...props} />
    </header>
  );
};
