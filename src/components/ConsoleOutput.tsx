import { Terminal, Send, Trash2, CheckCircle2, AlertOctagon } from 'lucide-react';

import { useConsoleInput } from '../hooks/useConsoleInput';
import { ExecutionStatus, ReadPrompt } from '../types/app';

interface ConsoleOutputProps {
  logs: string[];
  clearLogs: () => void;
  readPrompt?: ReadPrompt;
  status: ExecutionStatus;
}

export const ConsoleOutput = ({ logs, clearLogs, readPrompt, status }: ConsoleOutputProps) => {
  const { inputValue, setInputValue, handleSubmitInput } = useConsoleInput(readPrompt);

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Consola de Salida (Imprimir / Leer)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {status === 'running' && (
            <span className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Ejecutando...
            </span>
          )}
          {status === 'waiting_input' && (
            <span className="flex items-center gap-1.5 text-xs text-pink-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" />
              Esperando entrada...
            </span>
          )}
          {status === 'finished' && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Finalizado
            </span>
          )}
          {status === 'error' && (
            <span className="flex items-center gap-1 text-xs text-rose-400 font-medium">
              <AlertOctagon className="w-3.5 h-3.5" />
              Error
            </span>
          )}

          <button
            onClick={clearLogs}
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Limpiar consola"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-2 bg-slate-950/90 select-text">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs italic">
            <Terminal className="w-8 h-8 mb-2 opacity-30" />
            <span>Presiona "Ejecutar" para ver la salida del programa aquí.</span>
          </div>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              className={`leading-relaxed ${
                log.startsWith('Error')
                  ? 'text-rose-400 bg-rose-950/30 p-2 rounded border border-rose-900/50'
                  : log.startsWith('📥')
                    ? 'text-pink-300 font-semibold'
                    : 'text-slate-200'
              }`}
            >
              {log}
            </div>
          ))
        )}
      </div>

      {readPrompt && (
        <form
          onSubmit={handleSubmitInput}
          className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 animate-pulse"
        >
          <span className="text-xs font-semibold text-pink-300 whitespace-nowrap">
            {readPrompt.prompt}
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
            placeholder="Escribe la respuesta y presiona Enter..."
            className="flex-1 bg-slate-950 text-white text-sm px-3 py-1.5 rounded border border-pink-500/50 focus:outline-none focus:border-pink-400"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs rounded transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Enviar</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      )}
    </div>
  );
};
