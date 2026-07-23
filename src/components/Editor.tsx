import { Code, AlertCircle } from 'lucide-react';

import { useEditorSnippets } from '../hooks/useEditorSnippets';
import { EditorSnippetToolbar } from './EditorSnippetToolbar';

interface EditorProps {
  code: string;
  setCode: (code: string) => void;
  activeLine?: number;
  errorLine?: number;
  errorMessage?: string;
}

export const Editor = ({ code, setCode, activeLine, errorLine, errorMessage }: EditorProps) => {
  const { textareaRef, lineNumbersRef, snippets, handleScroll, insertSnippet } = useEditorSnippets(
    code,
    setCode
  );
  const lines = code.split('\n');

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Editor de Pseudocódigo
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-slate-400">Listo</span>
        </div>
      </div>

      <div className="relative flex-1 flex overflow-hidden bg-slate-950 font-mono text-sm">
        <div
          ref={lineNumbersRef}
          className="w-12 py-3 bg-slate-900/60 text-slate-550 border-r border-slate-800 select-none text-right pr-3 overflow-hidden text-xs"
        >
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const isActive = activeLine === lineNum;
            const isError = errorLine === lineNum;

            return (
              <div
                key={i}
                className={`h-6 leading-6 transition-colors ${
                  isError
                    ? 'text-rose-400 font-bold bg-rose-500/20'
                    : isActive
                      ? 'text-indigo-400 font-bold bg-indigo-500/20'
                      : 'text-slate-600'
                }`}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        <div className="relative flex-1 h-full overflow-hidden">
          {activeLine && (
            <div
              className="absolute left-0 right-0 bg-indigo-500/15 border-l-2 border-indigo-500 pointer-events-none transition-all duration-150"
              style={{
                top: `${(activeLine - 1) * 24 + 12}px`,
                height: '24px',
              }}
            />
          )}

          {errorLine && (
            <div
              className="absolute left-0 right-0 bg-rose-500/20 border-l-2 border-rose-500 pointer-events-none transition-all duration-150"
              style={{
                top: `${(errorLine - 1) * 24 + 12}px`,
                height: '24px',
              }}
            />
          )}

          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={handleScroll}
            spellCheck={false}
            className="w-full h-full p-3 bg-transparent text-slate-100 font-mono text-sm leading-6 resize-none focus:outline-none selection:bg-indigo-500/40 selection:text-white"
            placeholder="// Escribe tu programa en Pseudocódigo en español aquí...
Inicio
  Imprimir('¡Hola Mundo!')
Fin"
          />
        </div>
      </div>

      {/* Diagnostic Error Banner if present */}
      {errorMessage && (
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-950/80 border-t border-rose-800/80 text-rose-200 text-xs font-mono">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span className="truncate">{errorMessage}</span>
        </div>
      )}

      <EditorSnippetToolbar snippets={snippets} insertSnippet={insertSnippet} />
    </div>
  );
};
