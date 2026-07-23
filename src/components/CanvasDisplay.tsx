import { useRef } from 'react';
import { Palette, RefreshCw } from 'lucide-react';

import { useCanvasRenderer } from '../hooks/useCanvasRenderer';

export interface CanvasCommandItem {
  command: string;
  args: unknown[];
}

interface CanvasDisplayProps {
  commands: CanvasCommandItem[];
  onClear: () => void;
}

export const CanvasDisplay = ({ commands, onClear }: CanvasDisplayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useCanvasRenderer(canvasRef, commands);

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Pantalla Visual (Canvas 2D)
          </span>
        </div>

        <button
          onClick={onClear}
          className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          title="Limpiar Canvas"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-4 flex items-center justify-center bg-slate-950/80">
        <div className="relative border border-slate-800 rounded-xl overflow-hidden shadow-2xl bg-slate-900">
          <canvas ref={canvasRef} width={400} height={300} className="block bg-slate-950" />
        </div>
      </div>
    </div>
  );
};
