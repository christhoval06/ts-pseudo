import { BookOpen, Play, Square, StepForward, Zap } from 'lucide-react';

import { CodeExample, EXAMPLES } from '../compiler/examples';
import { FileControls } from './FileControls';

interface HeaderControlsProps {
  isRunning: boolean;
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

export function HeaderControls(props: HeaderControlsProps) {
  return (
    <div
      role="toolbar"
      aria-label="Controles principales"
      className="flex max-w-full flex-wrap items-center gap-1 rounded-lg border border-slate-800 bg-slate-950/70 p-1 shadow-inner"
    >
      <div className="flex items-center gap-1">
        {!props.isRunning ? (
          <button
            onClick={props.onRun}
            className="flex h-9 items-center gap-2 rounded-md bg-emerald-500 px-3.5 text-sm font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Ejecutar</span>
          </button>
        ) : (
          <button
            onClick={props.onStop}
            className="flex h-9 items-center gap-2 rounded-md bg-rose-500 px-3.5 text-sm font-bold text-white shadow-md shadow-rose-500/20 transition-all hover:bg-rose-400 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Detener</span>
          </button>
        )}

        <button
          onClick={props.onStep}
          disabled={props.isRunning}
          className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-indigo-200 transition-colors hover:bg-indigo-600/30 disabled:opacity-40 cursor-pointer"
          title="Ejecutar paso a paso"
        >
          <StepForward className="w-4 h-4" />
          <span className="hidden md:inline">Paso</span>
        </button>
      </div>

      <div className="flex h-9 items-center gap-2 border-l border-slate-800 pl-2 pr-1">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden text-xs font-medium text-slate-400 xl:inline">Velocidad</span>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={1050 - props.stepDelay}
          onChange={(event) => props.setStepDelay(1050 - parseInt(event.target.value, 10))}
          className="w-20 accent-indigo-500 cursor-pointer"
          title={`Retardo por paso: ${props.stepDelay}ms`}
        />
      </div>

      <div className="flex items-center gap-1 border-l border-slate-800 pl-1">
        <FileControls onSavePcode={props.onSavePcode} onOpenPcode={props.onOpenPcode} />
        <select
          onChange={(event) => {
            const selected = EXAMPLES.find((example) => example.id === event.target.value);
            if (selected) props.onSelectExample(selected);
          }}
          defaultValue=""
          className="h-9 max-w-36 rounded-md border border-transparent bg-transparent px-2.5 pr-7 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 focus:border-indigo-500 focus:outline-none cursor-pointer sm:max-w-44"
          title="Cargar ejemplo"
        >
          <option value="" disabled>
            Ejemplos
          </option>
          {EXAMPLES.map((example) => (
            <option key={example.id} value={example.id}>
              {example.title}
            </option>
          ))}
        </select>

        <button
          onClick={props.onOpenPlan}
          className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold text-purple-200 transition-colors hover:bg-purple-600/25 cursor-pointer"
          title="Plan del compilador"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden xl:inline">Plan</span>
        </button>
      </div>
    </div>
  );
}
