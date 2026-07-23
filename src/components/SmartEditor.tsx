import { AlertCircle, Code, WandSparkles } from 'lucide-react';
import { useRef } from 'react';

import { useCodeMirrorEditor } from '../hooks/useCodeMirrorEditor';

interface SmartEditorProps {
  code: string;
  setCode: (code: string) => void;
  activeLine?: number;
  errorLine?: number;
  errorMessage?: string;
}

export function SmartEditor(props: SmartEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  useCodeMirrorEditor(
    editorRef,
    props.code,
    props.setCode,
    props.activeLine,
    props.errorLine
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Editor inteligente de Pseudocodigo
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-300">
          <WandSparkles className="w-3.5 h-3.5" />
          <span>Autocomplete</span>
        </div>
      </div>

      <div ref={editorRef} className="relative flex-1 overflow-hidden bg-slate-950 text-sm" />

      {props.errorMessage && (
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-950/80 border-t border-rose-800/80 text-rose-200 text-xs font-mono">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span className="truncate">{props.errorMessage}</span>
        </div>
      )}
    </div>
  );
}
