import { ActiveTab, ExecutionStatus } from '../types/app';

export interface RuntimeErrorPresentation {
  status: ExecutionStatus;
  activeTab: ActiveTab;
  errorLine?: number;
  log: string;
}

export const extractRuntimeErrorLine = (message: string): number | undefined => {
  const lineMatch = message.match(/Linea (\d+)|Línea (\d+)/);
  const line = lineMatch?.[1] ?? lineMatch?.[2];
  return line ? parseInt(line, 10) : undefined;
};

export const getRuntimeErrorPresentation = (message: string): RuntimeErrorPresentation => ({
  status: 'error',
  activeTab: 'console',
  errorLine: extractRuntimeErrorLine(message),
  log: `Error: ${message}`,
});
