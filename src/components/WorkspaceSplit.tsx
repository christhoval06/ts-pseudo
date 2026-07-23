import { GripVertical } from 'lucide-react';
import { CSSProperties, ReactNode } from 'react';

import { useWorkspacePaneSizing } from '../hooks/useWorkspacePaneSizing';

interface WorkspaceSplitProps {
  editor: ReactNode;
  output: ReactNode;
}

export function WorkspaceSplit({ editor, output }: WorkspaceSplitProps) {
  const sizing = useWorkspacePaneSizing();

  return (
    <main
      className="flex-1 p-4 flex flex-col gap-3 max-w-[1800px] w-full mx-auto"
      style={{ '--editor-pane-width': `${sizing.editorWidthPercent}%` } as CSSProperties}
    >

      <div
        ref={sizing.workspaceRef}
        className={`flex-1 flex flex-col lg:flex-row gap-4 lg:gap-0 min-h-125 ${
          sizing.isResizing ? 'select-none cursor-col-resize' : ''
        }`}
      >
        <section className="workspace-editor-pane flex flex-col min-h-125 lg:min-h-0 lg:pr-2">
          {editor}
        </section>
        <button
          type="button"
          onPointerDown={(event) => {
            event.preventDefault();
            sizing.startResizing();
          }}
          onKeyDown={sizing.handleResizeKeyDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="Redimensionar editor y consola"
          aria-valuemin={35}
          aria-valuemax={75}
          aria-valuenow={sizing.editorWidthPercent}
          className="relative hidden lg:flex w-4 shrink-0 items-center justify-center text-slate-600 hover:text-indigo-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 cursor-col-resize transition-colors"
          title="Arrastra para redimensionar"
        >
          <span className="h-full w-px bg-slate-800" />
          <GripVertical className="absolute w-4 h-4 rounded bg-slate-950 text-slate-500" />
        </button>
        <div className="workspace-output-pane flex flex-col lg:pl-2">{output}</div>
      </div>
    </main>
  );
}
