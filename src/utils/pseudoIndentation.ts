export const PSEUDO_INDENT = '  ';

const leadingIndent = (line: string): string => line.match(/^\s*/)?.[0] ?? '';
const normalizeLine = (line: string): string => line.trim().toUpperCase();

const startsBlock = (line: string): boolean => {
  const normalized = normalizeLine(line);
  return (
    normalized === 'INICIO' ||
    normalized === 'REPETIR' ||
    normalized === 'SINO' ||
    normalized.startsWith('SINO_SI ') ||
    normalized.startsWith('SINOSI ') ||
    normalized.startsWith('TIPO ') ||
    normalized.startsWith('PROCESO ') ||
    /^SI\b.*\bENTONCES$/.test(normalized) ||
    /^MIENTRAS\b.*\bHACER$/.test(normalized) ||
    /^PARA\b.*\bHACER$/.test(normalized)
  );
};

export const isPseudoClosingLine = (line: string): boolean => {
  const normalized = normalizeLine(line);
  return (
    normalized === 'FIN' ||
    normalized === 'SINO' ||
    normalized.startsWith('SINO_SI ') ||
    normalized.startsWith('SINOSI ') ||
    normalized === 'FIN_SI' ||
    normalized === 'FINSI' ||
    normalized === 'FIN_MIENTRAS' ||
    normalized === 'FINMIENTRAS' ||
    normalized === 'FIN_PARA' ||
    normalized === 'FINPARA' ||
    normalized === 'FIN_PROCESO' ||
    normalized === 'FINPROCESO' ||
    normalized === 'FIN_TIPO' ||
    normalized === 'FINTIPO' ||
    normalized.startsWith('HASTA QUE') ||
    normalized.startsWith('HASTAQUE ')
  );
};

const getIndentLevelBeforeLine = (documentBeforeLine: string): number => {
  let level = 0;
  for (const line of documentBeforeLine.split('\n')) {
    if (!line.trim()) continue;
    if (isPseudoClosingLine(line)) level = Math.max(0, level - 1);
    if (startsBlock(line)) level += 1;
  }
  return level;
};

export const getIndentForNewLine = (previousLine: string): string => {
  const baseIndent = leadingIndent(previousLine);
  return startsBlock(previousLine) ? `${baseIndent}${PSEUDO_INDENT}` : baseIndent;
};

export const getIndentForTypedLine = (
  documentBeforeLine: string,
  currentLineText: string
): string => {
  const level = getIndentLevelBeforeLine(documentBeforeLine);
  const targetLevel = isPseudoClosingLine(currentLineText) ? Math.max(0, level - 1) : level;
  return PSEUDO_INDENT.repeat(targetLevel);
};
