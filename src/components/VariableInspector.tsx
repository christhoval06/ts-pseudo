import React from 'react';
import { Database, Hash, Type, ToggleLeft, Layers } from 'lucide-react';
import { VariableState } from '../compiler/interpreter';

interface VariableInspectorProps {
  variables: Map<string, VariableState>;
}

export const VariableInspector: React.FC<VariableInspectorProps> = ({ variables }) => {
  const varList = Array.from(variables.values());

  const getTypeIcon = (typeStr: string) => {
    switch (typeStr.toUpperCase()) {
      case 'ENTERO':
      case 'DECIMAL':
      case 'REAL':
        return <Hash className="w-3.5 h-3.5 text-cyan-400" />;
      case 'CADENA':
      case 'TEXTO':
        return <Type className="w-3.5 h-3.5 text-emerald-400" />;
      case 'BOOLEANO':
      case 'LOGICO':
        return <ToggleLeft className="w-3.5 h-3.5 text-purple-400" />;
      case 'ARRAY':
      case 'MATRIZ':
      case 'LISTA':
        return <Layers className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Database className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const formatValue = (val: unknown): string => {
    if (val === true) return 'VERDADERO';
    if (val === false) return 'FALSO';
    if (Array.isArray(val)) return `[ ${val.map((v) => formatValue(v)).join(', ')} ]`;
    return String(val);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Inspección de Memoria (Variables)
          </span>
        </div>
        <span className="text-xs text-slate-400">
          {varList.length} {varList.length === 1 ? 'variable' : 'variables'}
        </span>
      </div>

      {/* Variables List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-slate-950/80">
        {varList.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs italic">
            <span>No hay variables declaradas aún.</span>
          </div>
        ) : (
          varList.map((v) => (
            <div
              key={v.name}
              className="p-3 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded bg-slate-800">{getTypeIcon(v.type)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100 font-mono">{v.name}</span>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {v.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Value Display */}
              <div className="text-right font-mono text-sm font-semibold text-cyan-300 bg-slate-950 px-3 py-1 rounded border border-slate-800">
                {formatValue(v.value)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
