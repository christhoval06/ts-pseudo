import { FolderOpen, Save } from 'lucide-react';
import { useRef } from 'react';

interface FileControlsProps {
  onSavePcode: () => void;
  onOpenPcode: (file: File) => void;
}

export function FileControls({ onSavePcode, onOpenPcode }: FileControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        onClick={onSavePcode}
        className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 cursor-pointer"
        title="Guardar programa .pcode"
      >
        <Save className="w-4 h-4 text-cyan-300" />
        <span className="hidden lg:inline">Guardar</span>
      </button>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-800 cursor-pointer"
        title="Abrir programa .pcode"
      >
        <FolderOpen className="w-4 h-4 text-amber-300" />
        <span className="hidden lg:inline">Abrir</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pcode,text/plain"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onOpenPcode(file);
          event.target.value = '';
        }}
      />
    </>
  );
}
