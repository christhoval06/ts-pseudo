import { CheckCircle2, Code2, Cpu, Flame, LucideIcon, Sparkles } from 'lucide-react';
import { ReactNode } from 'react';

import { compilerPipeline, planKeywords, syntaxGroups, teachingFeatures } from '../data/planModal';

interface PlanSectionProps {
  icon: LucideIcon;
  title: string;
  accent: string;
  children: ReactNode;
}

function PlanSection({ icon: Icon, title, accent, children }: PlanSectionProps) {
  return (
    <div>
      <h3 className={`flex items-center gap-2 font-bold text-base mb-3 ${accent}`}>
        <Icon className="w-5 h-5" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export function PlanOverview() {
  return (
    <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/50 flex gap-4 items-start">
      <Sparkles className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-bold text-indigo-200 text-base mb-1">Objetivo Principal</h3>
        <p className="text-indigo-200/80 text-xs">
          Herramienta web en vivo para aprender pensamiento computacional con pseudocodigo en
          Espanol, resultados visuales inmediatos y palabras clave como{' '}
          {planKeywords.map((keyword, index) => (
            <code key={keyword} className="text-pink-300 font-mono">
              {index > 0 ? `, ${keyword}` : keyword}
            </code>
          ))}
          .
        </p>
      </div>
    </div>
  );
}

export function SyntaxSection() {
  return (
    <PlanSection icon={Code2} title="1. Diccionario y Sintaxis" accent="text-indigo-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {syntaxGroups.map(([title, detail]) => (
          <div key={title} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="font-bold text-slate-200 mb-1">{title}</div>
            <p className="font-mono text-slate-400">{detail}</p>
          </div>
        ))}
      </div>
    </PlanSection>
  );
}

export function PipelineSection() {
  return (
    <PlanSection icon={Cpu} title="2. Canal del Compilador" accent="text-purple-300">
      <div className="space-y-3 text-xs">
        {compilerPipeline.map(([number, title, detail]) => (
          <div key={number} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex gap-3 items-center">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-mono">
              {number}
            </div>
            <div>
              <div className="font-bold text-slate-200">{title}</div>
              <p className="text-slate-400">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </PlanSection>
  );
}

export function TeachingSection() {
  return (
    <PlanSection icon={Flame} title="3. Estrategia Pedagogica" accent="text-emerald-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {teachingFeatures.map((feature) => (
          <div key={feature} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </PlanSection>
  );
}
