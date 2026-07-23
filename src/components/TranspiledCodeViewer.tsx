import React from 'react';
import { FileCode2, Copy, Check } from 'lucide-react';
import { ProgramNode } from '../compiler/ast';
import { Transpiler } from '../compiler/transpiler';

interface TranspiledCodeViewerProps {
  programAst?: ProgramNode;
}

export const TranspiledCodeViewer: React.FC<TranspiledCodeViewerProps> = ({ programAst }) => {
  const [copied, setCopied] = React.useState(false);

  const transpiler = new Transpiler();
  const transpiledCode = programAst
    ? transpiler.transpile(programAst)
    : '// Presiona "Ejecutar" o compila el código para ver el resultado en TypeScript / JavaScript';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transpiledCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Código Transpilado (TypeScript / JavaScript)
          </span>
        </div>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
        </button>
      </div>

      {/* Code Display */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-amber-200/90 leading-6 bg-slate-950/90 select-text">
        <pre>{transpiledCode}</pre>
      </div>
    </div>
  );
};
