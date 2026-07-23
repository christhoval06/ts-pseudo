import { Lexer, LexerError } from '../compiler/lexer';
import { Parser, ParserError } from '../compiler/parser';

export interface PseudoSyntaxDiagnostic {
  line: number;
  column: number;
  message: string;
  severity: 'error';
}

const getDiagnosticMessage = (error: LexerError | ParserError): string => {
  const prefix = `Error ${error instanceof LexerError ? 'Léxico' : 'Sintáctico'} [Línea ${error.line}, Columna ${error.column}]: `;
  return error.message.startsWith(prefix) ? error.message.slice(prefix.length) : error.message;
};

const toDiagnostic = (error: LexerError | ParserError): PseudoSyntaxDiagnostic => ({
  line: error.line,
  column: error.column,
  message: getDiagnosticMessage(error),
  severity: 'error',
});

export const validatePseudoSyntax = (code: string): PseudoSyntaxDiagnostic[] => {
  if (!code.trim()) return [];

  try {
    const tokens = new Lexer(code).tokenize();
    new Parser(tokens).parse();
    return [];
  } catch (error) {
    if (error instanceof LexerError || error instanceof ParserError) {
      return [toDiagnostic(error)];
    }
    throw error;
  }
};
