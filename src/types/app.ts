import { VariableState } from '../compiler/interpreter';

export type ExecutionStatus = 'idle' | 'running' | 'waiting_input' | 'finished' | 'error';
export type ActiveTab = 'console' | 'canvas' | 'transpile' | 'variables';

export interface ReadPrompt {
  prompt: string;
  callback: (input: string) => void;
}

export type VariablesMap = Map<string, VariableState>;
