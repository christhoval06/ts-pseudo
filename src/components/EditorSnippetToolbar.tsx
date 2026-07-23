import { Lightbulb } from 'lucide-react';

import { SnippetAction } from '../hooks/useEditorSnippets';

interface EditorSnippetToolbarProps {
  snippets: SnippetAction[];
  insertSnippet: (snippet: string) => void;
}

export function EditorSnippetToolbar({ snippets, insertSnippet }: EditorSnippetToolbarProps) {
  return (
    <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
      <div className="flex items-center gap-1 text-slate-400 font-medium whitespace-nowrap">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
        <span>Insertar rapido:</span>
      </div>
      {snippets.map((snippet) => (
        <button
          key={snippet.label}
          onClick={() => insertSnippet(snippet.value)}
          className={`px-2 py-1 bg-slate-800 hover:bg-slate-700 ${snippet.className} rounded border border-slate-700 whitespace-nowrap transition-colors cursor-pointer`}
        >
          {snippet.label}
        </button>
      ))}
    </div>
  );
}
