import { Token, TokenType, SPANISH_KEYWORDS } from './tokens';

export class LexerError extends Error {
  constructor(
    message: string,
    public line: number,
    public column: number
  ) {
    super(`Error Léxico [Línea ${line}, Columna ${column}]: ${message}`);
    this.name = 'LexerError';
  }
}

export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.position < this.source.length) {
      const char = this.source[this.position];

      // Skip Whitespace (spaces, tabs, carriage returns)
      if (char === ' ' || char === '\t' || char === '\r') {
        this.advance();
        continue;
      }

      // Handle Newlines
      if (char === '\n') {
        this.line++;
        this.column = 1;
        this.position++;
        continue;
      }

      // Comments (// single-line or /* multi-line */ or # single-line)
      if (char === '/' && this.peek() === '/') {
        this.skipSingleLineComment();
        continue;
      }
      if (char === '#') {
        this.skipSingleLineComment();
        continue;
      }
      if (char === '/' && this.peek() === '*') {
        this.skipMultiLineComment();
        continue;
      }

      // Strings ("..." or '...')
      if (char === '"' || char === "'") {
        tokens.push(this.readString(char));
        continue;
      }

      // Numbers
      if (this.isDigit(char)) {
        tokens.push(this.readNumber());
        continue;
      }

      // Identifiers / Keywords / Multi-word tokens
      if (this.isAlpha(char)) {
        tokens.push(this.readIdentifierOrKeyword());
        continue;
      }

      // Symbols and Operators
      if (char === '<' && this.peek() === '-') {
        const startCol = this.column;
        this.advance();
        this.advance();
        tokens.push({ type: TokenType.ASIGNAR, value: '<-', line: this.line, column: startCol });
        continue;
      }

      if (char === '=' && this.peek() === '=') {
        const startCol = this.column;
        this.advance();
        this.advance();
        tokens.push({ type: TokenType.IGUAL, value: '==', line: this.line, column: startCol });
        continue;
      }

      if (char === '!' && this.peek() === '=') {
        const startCol = this.column;
        this.advance();
        this.advance();
        tokens.push({ type: TokenType.DIFERENTE, value: '!=', line: this.line, column: startCol });
        continue;
      }

      if (char === '<' && this.peek() === '=') {
        const startCol = this.column;
        this.advance();
        this.advance();
        tokens.push({
          type: TokenType.MENOR_IGUAL,
          value: '<=',
          line: this.line,
          column: startCol,
        });
        continue;
      }

      if (char === '>' && this.peek() === '=') {
        const startCol = this.column;
        this.advance();
        this.advance();
        tokens.push({
          type: TokenType.MAYOR_IGUAL,
          value: '>=',
          line: this.line,
          column: startCol,
        });
        continue;
      }

      // Single Character Symbols
      const symbolMap: Record<string, TokenType> = {
        '=': TokenType.ASIGNAR,
        '+': TokenType.SUMA,
        '-': TokenType.RESTA,
        '*': TokenType.MULTIPLICACION,
        '/': TokenType.DIVISION,
        '%': TokenType.MODULO,
        '^': TokenType.POTENCIA,
        '<': TokenType.MENOR,
        '>': TokenType.MAYOR,
        '(': TokenType.LPAREN,
        ')': TokenType.RPAREN,
        '[': TokenType.LBRACKET,
        ']': TokenType.RBRACKET,
        ',': TokenType.COMMA,
        ':': TokenType.COLON,
        '.': TokenType.DOT,
      };

      if (symbolMap[char]) {
        tokens.push({
          type: symbolMap[char],
          value: char,
          line: this.line,
          column: this.column,
        });
        this.advance();
        continue;
      }

      throw new LexerError(`Carácter no reconocido: '${char}'`, this.line, this.column);
    }

    tokens.push({
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column,
    });

    return tokens;
  }

  private advance(): void {
    this.position++;
    this.column++;
  }

  private peek(offset: number = 1): string {
    if (this.position + offset >= this.source.length) return '';
    return this.source[this.position + offset];
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  private isAlpha(char: string): boolean {
    return (
      (char >= 'a' && char <= 'z') ||
      (char >= 'A' && char <= 'Z') ||
      char === '_' ||
      char === 'ñ' ||
      char === 'Ñ' ||
      'áéíóúÁÉÍÓÚ'.includes(char)
    );
  }

  private skipSingleLineComment(): void {
    while (this.position < this.source.length && this.source[this.position] !== '\n') {
      this.advance();
    }
  }

  private skipMultiLineComment(): void {
    this.advance(); // /
    this.advance(); // *
    while (this.position < this.source.length) {
      if (this.source[this.position] === '*' && this.peek() === '/') {
        this.advance(); // *
        this.advance(); // /
        return;
      }
      if (this.source[this.position] === '\n') {
        this.line++;
        this.column = 1;
        this.position++;
      } else {
        this.advance();
      }
    }
  }

  private readString(quote: string): Token {
    const startLine = this.line;
    const startCol = this.column;
    this.advance(); // Skip opening quote

    let value = '';
    while (this.position < this.source.length && this.source[this.position] !== quote) {
      if (this.source[this.position] === '\n') {
        throw new LexerError('Texto sin cerrar antes del salto de línea', startLine, startCol);
      }
      value += this.source[this.position];
      this.advance();
    }

    if (this.position >= this.source.length) {
      throw new LexerError('Comilla sin cerrar al final del archivo', startLine, startCol);
    }

    this.advance(); // Skip closing quote
    return {
      type: TokenType.CADENA,
      value,
      line: startLine,
      column: startCol,
    };
  }

  private readNumber(): Token {
    const startCol = this.column;
    let numStr = '';

    while (this.position < this.source.length && this.isDigit(this.source[this.position])) {
      numStr += this.source[this.position];
      this.advance();
    }

    if (this.source[this.position] === '.' && this.isDigit(this.peek())) {
      numStr += '.';
      this.advance(); // skip dot
      while (this.position < this.source.length && this.isDigit(this.source[this.position])) {
        numStr += this.source[this.position];
        this.advance();
      }
    }

    return {
      type: TokenType.NUMERO,
      value: numStr,
      line: this.line,
      column: startCol,
    };
  }

  private readIdentifierOrKeyword(): Token {
    const startCol = this.column;
    let word = '';

    while (
      this.position < this.source.length &&
      (this.isAlpha(this.source[this.position]) || this.isDigit(this.source[this.position]))
    ) {
      word += this.source[this.position];
      this.advance();
    }

    const upperWord = word.toUpperCase();
    const keywordType = SPANISH_KEYWORDS[upperWord];

    if (keywordType) {
      return {
        type: keywordType,
        value: upperWord,
        line: this.line,
        column: startCol,
      };
    }

    return {
      type: TokenType.IDENTIFICADOR,
      value: word,
      line: this.line,
      column: startCol,
    };
  }
}
