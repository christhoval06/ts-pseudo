import { X, BookOpen } from 'lucide-react';

import { PipelineSection, PlanOverview, SyntaxSection, TeachingSection } from './PlanModalSections';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlanModal = ({ isOpen, onClose }: PlanModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Plan del Compilador de Pseudocódigo en Español (ts-pseudo)
              </h2>
              <p className="text-xs text-slate-400">
                Diseñado para la enseñanza interactiva de programación a niños
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-300 max-h-[75vh] overflow-y-auto leading-relaxed">
          <PlanOverview />
          <SyntaxSection />
          <PipelineSection />
          <TeachingSection />
        </div>

        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            Entendido, ¡Empezar a Programar!
          </button>
        </div>
      </div>
    </div>
  );
};
