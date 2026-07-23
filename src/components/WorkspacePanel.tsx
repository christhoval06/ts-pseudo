import { Database, FileCode2, Palette, Terminal } from 'lucide-react';

import { ProgramNode } from '../compiler/ast';
import { ActiveTab, ExecutionStatus, ReadPrompt, VariablesMap } from '../types/app';
import { CanvasCommandItem, CanvasDisplay } from './CanvasDisplay';
import { ConsoleOutput } from './ConsoleOutput';
import { TranspiledCodeViewer } from './TranspiledCodeViewer';
import { VariableInspector } from './VariableInspector';

interface WorkspacePanelProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  logs: string[];
  clearLogs: () => void;
  readPrompt?: ReadPrompt;
  status: ExecutionStatus;
  canvasCommands: CanvasCommandItem[];
  clearCanvas: () => void;
  variables: VariablesMap;
  programAst?: ProgramNode;
}

const tabs = [
  {
    id: 'console',
    label: 'Consola',
    icon: Terminal,
    active: 'bg-indigo-600 text-white shadow-md',
    count: 'bg-indigo-900 text-indigo-200',
  },
  {
    id: 'canvas',
    label: 'Canvas 2D',
    icon: Palette,
    active: 'bg-purple-600 text-white shadow-md',
    count: 'bg-purple-900 text-purple-200',
  },
  {
    id: 'variables',
    label: 'Variables',
    icon: Database,
    active: 'bg-cyan-600 text-white shadow-md',
    count: 'bg-cyan-900 text-cyan-200',
  },
  {
    id: 'transpile',
    label: 'TypeScript',
    icon: FileCode2,
    active: 'bg-amber-600 text-white shadow-md',
    count: 'bg-amber-900 text-amber-200',
  },
] as const;

export function WorkspacePanel(props: WorkspacePanelProps) {
  const countFor = (tab: ActiveTab) => {
    if (tab === 'console') return props.logs.length;
    if (tab === 'canvas') return props.canvasCommands.length;
    return undefined;
  };

  return (
    <section className="lg:col-span-5 flex flex-col min-h-[500px] bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center bg-slate-950 border-b border-slate-800 p-1.5 gap-1 overflow-x-auto text-xs font-semibold">
        {tabs.map(({ id, label, icon: Icon, active, count: countClass }) => {
          const isActive = props.activeTab === id;
          const count = countFor(id);

          return (
            <button
              key={id}
              onClick={() => props.setActiveTab(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? active
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{id === 'variables' ? `${label} (${props.variables.size})` : label}</span>
              {!!count && (
                <span className={`px-1.5 py-0.2 text-[10px] ${countClass} rounded-full font-bold`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 p-2 bg-slate-950/40">
        {props.activeTab === 'console' && (
          <ConsoleOutput
            logs={props.logs}
            clearLogs={props.clearLogs}
            readPrompt={props.readPrompt}
            status={props.status}
          />
        )}
        {props.activeTab === 'canvas' && (
          <CanvasDisplay commands={props.canvasCommands} onClear={props.clearCanvas} />
        )}
        {props.activeTab === 'variables' && <VariableInspector variables={props.variables} />}
        {props.activeTab === 'transpile' && <TranspiledCodeViewer programAst={props.programAst} />}
      </div>
    </section>
  );
}
