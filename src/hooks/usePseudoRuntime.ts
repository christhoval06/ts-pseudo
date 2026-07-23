import { useRef, useState } from 'react';
import confetti from 'canvas-confetti';

import { CanvasCommandItem } from '../components/CanvasDisplay';
import { ProgramNode } from '../compiler/ast';
import { CodeExample, EXAMPLES } from '../compiler/examples';
import { Interpreter } from '../compiler/interpreter';
import { Lexer } from '../compiler/lexer';
import { Parser } from '../compiler/parser';
import { ActiveTab, ExecutionStatus, ReadPrompt, VariablesMap } from '../types/app';
import { useSoundSynth } from './useSoundSynth';

const extractLine = (message: string) => {
  const lineMatch = message.match(/Linea (\d+)|Línea (\d+)/);
  const line = lineMatch?.[1] ?? lineMatch?.[2];
  return line ? parseInt(line, 10) : undefined;
};

export function usePseudoRuntime() {
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [logs, setLogs] = useState<string[]>([]);
  const [canvasCommands, setCanvasCommands] = useState<CanvasCommandItem[]>([]);
  const [variables, setVariables] = useState<VariablesMap>(new Map());
  const [activeLine, setActiveLine] = useState<number>();
  const [errorLine, setErrorLine] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [activeTab, setActiveTab] = useState<ActiveTab>('console');
  const [readPrompt, setReadPrompt] = useState<ReadPrompt>();
  const [stepDelay, setStepDelay] = useState(200);
  const interpreterRef = useRef<Interpreter | null>(null);
  const programAstRef = useRef<ProgramNode | undefined>(undefined);
  const stepDelayRef = useRef(stepDelay);
  const { playSoundNote } = useSoundSynth();
  stepDelayRef.current = stepDelay;
  const resetExecution = () => {
    setLogs([]);
    setCanvasCommands([]);
    setVariables(new Map());
    setActiveLine(undefined);
    setErrorLine(undefined);
    setErrorMessage(undefined);
    setReadPrompt(undefined);
  };
  const reportError = (message: string) => {
    setStatus('error');
    setErrorMessage(message);
    setLogs((prev) => [...prev, `Error: ${message}`]);
    setErrorLine(extractLine(message));
  };
  const handleRun = async () => {
    resetExecution();
    setStatus('running');
    try {
      const lexer = new Lexer(code);
      const parser = new Parser(lexer.tokenize());
      const ast = parser.parse();
      programAstRef.current = ast;
      interpreterRef.current = new Interpreter({
        onPrint: (msg) => setLogs((prev) => [...prev, `> ${msg}`]),
        onCanvas: (command, args) => {
          setCanvasCommands((prev) => [...prev, { command, args }]);
          setActiveTab('canvas');
        },
        onSound: playSoundNote,
        onVariableUpdate: setVariables,
        onError: reportError,
        onStep: async (pos) => {
          if (pos) setActiveLine(pos.line);
          if (stepDelayRef.current > 0) {
            await new Promise((res) => setTimeout(res, stepDelayRef.current));
          }
        },
        onRead: (promptMsg, callback) => {
          setStatus('waiting_input');
          setActiveTab('console');
          setLogs((prev) => [...prev, `📥 ${promptMsg}`]);
          setReadPrompt({
            prompt: promptMsg,
            callback: (input) => {
              setLogs((prev) => [...prev, `  └─ Entrado: ${input}`]);
              setReadPrompt(undefined);
              setStatus('running');
              callback(input);
            },
          });
        },
        onFinished: () => {
          setStatus('finished');
          setActiveLine(undefined);
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        },
      });
      await interpreterRef.current.execute(ast);
    } catch (err) {
      reportError(err instanceof Error ? err.message : String(err));
    }
  };
  const handleStop = () => {
    interpreterRef.current?.stop();
    setStatus('idle');
    setActiveLine(undefined);
    setReadPrompt(undefined);
  };
  const handleSelectExample = (example: CodeExample) => {
    handleStop();
    setCode(example.code);
    resetExecution();
  };
  const handleLoadProgram = (nextCode: string) => {
    handleStop(); setCode(nextCode); resetExecution();
  };
  return {
    code, setCode, logs, setLogs, canvasCommands, setCanvasCommands, variables,
    activeLine, errorLine, errorMessage, status, activeTab, setActiveTab,
    readPrompt, stepDelay, setStepDelay, programAst: programAstRef.current,
    handleRun, handleStop, handleSelectExample, handleLoadProgram,
  };
}
