import { useState } from 'react';

import { Header } from './components/Header';
import { PlanModal } from './components/PlanModal';
import { SmartEditor } from './components/SmartEditor';
import { WorkspacePanel } from './components/WorkspacePanel';
import { WorkspaceSplit } from './components/WorkspaceSplit';
import { usePcodeFiles } from './hooks/usePcodeFiles';
import { usePseudoRuntime } from './hooks/usePseudoRuntime';

export function App() {
  const runtime = usePseudoRuntime();
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const pcodeFiles = usePcodeFiles(runtime.code, runtime.handleLoadProgram);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        isRunning={runtime.status === 'running' || runtime.status === 'waiting_input'}
        isPaused={false}
        onRun={runtime.handleRun}
        onStop={runtime.handleStop}
        onStep={runtime.handleRun}
        onSelectExample={runtime.handleSelectExample}
        onOpenPlan={() => setIsPlanOpen(true)}
        onSavePcode={pcodeFiles.handleSavePcode}
        onOpenPcode={pcodeFiles.handleOpenPcode}
        stepDelay={runtime.stepDelay}
        setStepDelay={runtime.setStepDelay}
      />

      <WorkspaceSplit
        editor={
          <SmartEditor
            code={runtime.code}
            setCode={runtime.setCode}
            activeLine={runtime.activeLine}
            errorLine={runtime.errorLine}
            errorMessage={runtime.errorMessage}
          />
        }
        output={
          <WorkspacePanel
            activeTab={runtime.activeTab}
            setActiveTab={runtime.setActiveTab}
            logs={runtime.logs}
            clearLogs={() => runtime.setLogs([])}
            readPrompt={runtime.readPrompt}
            status={runtime.status}
            canvasCommands={runtime.canvasCommands}
            clearCanvas={() => runtime.setCanvasCommands([])}
            variables={runtime.variables}
            programAst={runtime.programAst}
          />
        }
      />

      <PlanModal isOpen={isPlanOpen} onClose={() => setIsPlanOpen(false)} />
    </div>
  );
}

export default App;
