import { Token, TokenType } from './tokens';
import {
  ProgramNode,
  ASTNode,
  VarDeclarationNode,
  TypeDeclarationNode,
  ProcedureNode,
  AssignmentNode,
  ExpressionStatementNode,
  PrintNode,
  ReadNode,
  IfNode,
  WhileNode,
  RepeatUntilNode,
  ForNode,
  PauseNode,
  CanvasNode,
  SoundNode,
  ExpressionNode,
} from './ast';

export class ParserError extends Error {
  constructor(
    message: string,
    public line: number,
    public column: number
  ) {
    super(`Error Sintáctico [Línea ${line}, Columna ${column}]: ${message}`);
    this.name = 'ParserError';
  }
}

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public parse(): ProgramNode {
    const body: ASTNode[] = [];

    while (this.check(TokenType.TIPO) || this.check(TokenType.PROCESO) || this.check(TokenType.CONSTANTE)) {
      body.push(this.parseStatement());
    }

    if (!this.check(TokenType.INICIO)) {
      const token = this.peek();
      throw new ParserError(
        "No se detectó el programa principal. Usa 'INICIO' ... 'FIN'",
        token.line,
        token.column
      );
    }

    this.advance();

    while (!this.isAtEnd() && !this.check(TokenType.FIN)) {
      body.push(this.parseStatement());
    }

    if (!this.check(TokenType.FIN)) {
      const token = this.peek();
      throw new ParserError("Se esperaba 'FIN' al cerrar el programa principal", token.line, token.column);
    }

    this.advance();

    if (!this.isAtEnd()) {
      const token = this.peek();
      throw new ParserError(
        `No se esperaban instrucciones después de 'FIN': '${token.value}'`,
        token.line,
        token.column
      );
    }

    return {
      type: 'Program',
      body,
    };
  }

  private parseStatement(): ASTNode {
    const token = this.peek();

    switch (token.type) {
      case TokenType.DEFINIR:
      case TokenType.CONSTANTE:
      case TokenType.VAR:
        return this.parseVarDeclaration();

      case TokenType.TIPO:
        return this.parseTypeDeclaration();

      case TokenType.PROCESO:
        return this.parseProcedure();

      case TokenType.IMPRIMIR:
        return this.parsePrint();

      case TokenType.LEER:
        return this.parseRead();

      case TokenType.SI:
        return this.parseIf();

      case TokenType.MIENTRAS:
        return this.parseWhile();

      case TokenType.REPETIR:
        return this.parseRepeatUntil();

      case TokenType.PARA:
        return this.parseFor();

      case TokenType.PAUSAR:
        return this.parsePause();

      case TokenType.DIBUJAR_CIRCULO:
      case TokenType.DIBUJAR_RECTANGULO:
      case TokenType.DIBUJAR_LINEA:
      case TokenType.LIMPIAR_CANVAS:
      case TokenType.COLOR_PINCEL:
        return this.parseCanvasCommand();

      case TokenType.TOCAR_NOTA:
        return this.parseSoundCommand();

      case TokenType.IDENTIFICADOR:
        return this.parseAssignmentOrCall();

      default:
        throw new ParserError(
          `Instrucción no esperada o no válida '${token.value}'`,
          token.line,
          token.column
        );
    }
  }

  private parseVarDeclaration(): VarDeclarationNode {
    const isDefinir = this.check(TokenType.DEFINIR);
    const isConstant = this.check(TokenType.CONSTANTE);
    const startToken = this.advance(); // DEFINIR or VAR

    let identifier = '';
    let varType = 'ENTERO';
    let dimensions: ExpressionNode[] | undefined = undefined;

    if (isDefinir || isConstant) {
      // DEFINIR/CONSTANTE nombre_variable COMO tipo_dato
      const nameToken = this.consume(
        TokenType.IDENTIFICADOR,
        `Se esperaba el nombre ${isConstant ? 'de la constante' : 'de la variable'} después de '${startToken.value}'`
      );
      identifier = nameToken.value;

      if (this.check(TokenType.LBRACKET)) {
        dimensions = this.parseIndexExpressions();
      }

      this.consume(
        TokenType.COMO,
        `Se esperaba 'COMO' después del nombre '${identifier}' en ${startToken.value}`
      );

      varType = this.parseTypeName();
    } else {
      // VAR tipo_dato nombre_variable
      if (this.isTypeName(this.peek())) {
        varType = this.parseTypeName();
      }

      const nameToken = this.consume(
        TokenType.IDENTIFICADOR,
        'Se esperaba un nombre de variable (identificador)'
      );
      identifier = nameToken.value;
    }

    let value: ExpressionNode | undefined = undefined;

    if (this.check(TokenType.ASIGNAR)) {
      this.advance();
      value = this.parseExpression();
    }

    if (isConstant && !value) {
      const token = this.peek();
      throw new ParserError(
        `La constante '${identifier}' debe inicializarse con '<-' o '='`,
        token.line,
        token.column
      );
    }

    return {
      type: 'VarDeclaration',
      varType,
      identifier,
      dimensions,
      value,
      isConstant,
      pos: { line: startToken.line, column: startToken.column },
    };
  }

  private parseTypeDeclaration(): TypeDeclarationNode {
    const typeToken = this.consume(TokenType.TIPO, "Se esperaba 'TIPO'");
    const nameToken = this.consume(
      TokenType.IDENTIFICADOR,
      "Se esperaba el nombre del tipo después de 'TIPO'"
    );

    const fields = [];
    while (!this.isAtEnd() && !this.check(TokenType.FIN_TIPO)) {
      const fieldToken = this.consume(
        TokenType.IDENTIFICADOR,
        'Se esperaba el nombre del campo dentro de TIPO'
      );
      this.consume(TokenType.COMO, `Se esperaba 'COMO' después del campo '${fieldToken.value}'`);
      fields.push({
        name: fieldToken.value,
        fieldType: this.parseTypeName(),
        pos: { line: fieldToken.line, column: fieldToken.column },
      });
    }

    this.consume(TokenType.FIN_TIPO, "Se esperaba 'FIN_TIPO' o 'FINTIPO' al cerrar TIPO");

    return {
      type: 'TypeDeclaration',
      name: nameToken.value,
      fields,
      pos: { line: typeToken.line, column: typeToken.column },
    };
  }

  private parseProcedure(): ProcedureNode {
    const procedureToken = this.consume(TokenType.PROCESO, "Se esperaba 'PROCESO'");
    const nameToken = this.consume(
      TokenType.IDENTIFICADOR,
      "Se esperaba el nombre del proceso después de 'PROCESO'"
    );
    const params = [];

    this.consume(TokenType.LPAREN, `Se esperaba '(' después del nombre del proceso '${nameToken.value}'`);

    if (!this.check(TokenType.RPAREN)) {
      do {
        const paramToken = this.consume(
          TokenType.IDENTIFICADOR,
          'Se esperaba el nombre del parámetro'
        );
        this.consume(TokenType.COMO, `Se esperaba 'COMO' después del parámetro '${paramToken.value}'`);
        params.push({
          name: paramToken.value,
          paramType: this.parseTypeName(),
          pos: { line: paramToken.line, column: paramToken.column },
        });

        if (this.check(TokenType.COMMA)) {
          this.advance();
        } else {
          break;
        }
      } while (!this.isAtEnd());
    }

    this.consume(TokenType.RPAREN, `Se esperaba ')' al cerrar PROCESO ${nameToken.value}`);

    const body: ASTNode[] = [];
    while (!this.isAtEnd() && !this.check(TokenType.FIN_PROCESO)) {
      body.push(this.parseStatement());
    }

    this.consume(
      TokenType.FIN_PROCESO,
      "Se esperaba 'FIN_PROCESO' o 'FINPROCESO' al cerrar PROCESO"
    );

    return {
      type: 'Procedure',
      name: nameToken.value,
      params,
      body,
      pos: { line: procedureToken.line, column: procedureToken.column },
    };
  }

  private parseAssignmentOrCall(): AssignmentNode | ExpressionStatementNode {
    const nameToken = this.consume(TokenType.IDENTIFICADOR, 'Se esperaba nombre de variable');

    if (this.check(TokenType.LPAREN)) {
      this.advance();
      const args: ExpressionNode[] = [];
      if (!this.check(TokenType.RPAREN)) {
        do {
          args.push(this.parseExpression());
          if (this.check(TokenType.COMMA)) this.advance();
          else break;
        } while (!this.isAtEnd());
      }
      this.consume(TokenType.RPAREN, `Se esperaba ')' al cerrar la llamada ${nameToken.value}`);
      return {
        type: 'ExpressionStatement',
        expression: {
          type: 'FunctionCall',
          name: nameToken.value,
          args,
          pos: { line: nameToken.line, column: nameToken.column },
        },
        pos: { line: nameToken.line, column: nameToken.column },
      };
    }

    let propertyName: string | undefined = undefined;
    let indexExpr: ExpressionNode | undefined = undefined;
    let indexExprs: ExpressionNode[] | undefined = undefined;

    if (this.check(TokenType.DOT)) {
      this.advance();
      propertyName = this.consume(
        TokenType.IDENTIFICADOR,
        "Se esperaba el nombre del campo después de '.'"
      ).value;
    } else if (this.check(TokenType.LBRACKET)) {
      indexExprs = this.parseIndexExpressions();
      indexExpr = indexExprs[0];
    }

    this.consume(TokenType.ASIGNAR, "Se esperaba '=' o '<-' para asignar un valor");
    const value = this.parseExpression();

    return {
      type: 'Assignment',
      identifier: nameToken.value,
      propertyName,
      indexExpr,
      indexExprs,
      value,
      pos: { line: nameToken.line, column: nameToken.column },
    };
  }

  private parseIndexExpressions(): ExpressionNode[] {
    this.consume(TokenType.LBRACKET, "Se esperaba '[' para iniciar índice");
    const indexes: ExpressionNode[] = [];

    do {
      indexes.push(this.parseExpression());
      if (this.check(TokenType.COMMA)) {
        this.advance();
      } else {
        break;
      }
    } while (!this.isAtEnd());

    this.consume(TokenType.RBRACKET, "Se esperaba ']' después del índice");
    return indexes;
  }

  private parseTypeName(): string {
    const typeToken = this.peek();
    if (this.isTypeName(typeToken)) {
      this.advance();
      return typeToken.value;
    }

    throw new ParserError(
      `Se esperaba un tipo de dato válido (ENTERO, DECIMAL, TEXTO, LOGICO, MATRIZ o un TIPO definido) pero se encontró '${typeToken.value}'`,
      typeToken.line,
      typeToken.column
    );
  }

  private isTypeName(token: Token): boolean {
    return (
      token.type === TokenType.T_ENTERO ||
      token.type === TokenType.T_DECIMAL ||
      token.type === TokenType.T_CADENA ||
      token.type === TokenType.T_LOGICO ||
      token.type === TokenType.T_ARRAY ||
      token.type === TokenType.IDENTIFICADOR
    );
  }

  private parsePrint(): PrintNode {
    const printToken = this.consume(TokenType.IMPRIMIR, "Se esperaba 'IMPRIMIR' o 'MOSTRAR'");
    const expressions: ExpressionNode[] = [];

    // Check if arguments are wrapped in parens or comma separated
    let hasParens = false;
    if (this.check(TokenType.LPAREN)) {
      hasParens = true;
      this.advance();
    }

    do {
      if (hasParens && this.check(TokenType.RPAREN)) break;
      expressions.push(this.parseExpression());
      if (this.check(TokenType.COMMA)) {
        this.advance();
      } else {
        break;
      }
    } while (!this.isAtEnd());

    if (hasParens) {
      this.consume(TokenType.RPAREN, "Se esperaba ')' al cerrar IMPRIMIR(...)");
    }

    return {
      type: 'Print',
      expressions,
      pos: { line: printToken.line, column: printToken.column },
    };
  }

  private parseRead(): ReadNode {
    const readToken = this.consume(TokenType.LEER, "Se esperaba 'LEER'");
    let prompt: string | undefined = undefined;

    if (this.check(TokenType.LPAREN)) {
      this.advance();
      if (this.check(TokenType.CADENA)) {
        prompt = this.peek().value;
        this.advance();
        if (this.check(TokenType.COMMA)) this.advance();
      }
    }

    const varToken = this.consume(
      TokenType.IDENTIFICADOR,
      'Se esperaba el nombre de la variable para guardar la lectura'
    );

    if (this.check(TokenType.RPAREN)) {
      this.advance();
    }

    return {
      type: 'Read',
      identifier: varToken.value,
      prompt,
      pos: { line: readToken.line, column: readToken.column },
    };
  }

  private parseIf(): IfNode {
    const ifToken = this.consume(TokenType.SI, "Se esperaba 'SI'");
    const condition = this.parseExpression();

    this.consume(TokenType.ENTONCES, "Se esperaba 'ENTONCES' después de la condición del SI");

    const thenBranch: ASTNode[] = [];
    const elseBranch: ASTNode[] = [];

    while (
      !this.isAtEnd() &&
      !this.check(TokenType.SINO) &&
      !this.check(TokenType.SINO_SI) &&
      !this.check(TokenType.FIN_SI)
    ) {
      thenBranch.push(this.parseStatement());
    }

    if (this.check(TokenType.SINO_SI)) {
      elseBranch.push(this.parseElseIf());
    } else if (this.check(TokenType.SINO)) {
      this.advance();
      while (!this.isAtEnd() && !this.check(TokenType.FIN_SI)) {
        elseBranch.push(this.parseStatement());
      }
    }

    this.consume(TokenType.FIN_SI, "Se esperaba 'FIN_SI' o 'FINSI' al terminar el bloque SI");

    return {
      type: 'If',
      condition,
      thenBranch,
      elseBranch: elseBranch.length > 0 ? elseBranch : undefined,
      pos: { line: ifToken.line, column: ifToken.column },
    };
  }

  private parseElseIf(): IfNode {
    const elseIfToken = this.consume(TokenType.SINO_SI, "Se esperaba 'SINO_SI'");
    const condition = this.parseExpression();

    this.consume(TokenType.ENTONCES, "Se esperaba 'ENTONCES' después de la condición del SINO_SI");

    const thenBranch: ASTNode[] = [];
    const elseBranch: ASTNode[] = [];

    while (
      !this.isAtEnd() &&
      !this.check(TokenType.SINO) &&
      !this.check(TokenType.SINO_SI) &&
      !this.check(TokenType.FIN_SI)
    ) {
      thenBranch.push(this.parseStatement());
    }

    if (this.check(TokenType.SINO_SI)) {
      elseBranch.push(this.parseElseIf());
    } else if (this.check(TokenType.SINO)) {
      this.advance();
      while (!this.isAtEnd() && !this.check(TokenType.FIN_SI)) {
        elseBranch.push(this.parseStatement());
      }
    }

    return {
      type: 'If',
      condition,
      thenBranch,
      elseBranch: elseBranch.length > 0 ? elseBranch : undefined,
      pos: { line: elseIfToken.line, column: elseIfToken.column },
    };
  }

  private parseWhile(): WhileNode {
    const whileToken = this.consume(TokenType.MIENTRAS, "Se esperaba 'MIENTRAS'");
    const condition = this.parseExpression();

    this.consume(TokenType.HACER, "Se esperaba 'HACER' después de la condición de MIENTRAS");

    const body: ASTNode[] = [];
    while (!this.isAtEnd() && !this.check(TokenType.FIN_MIENTRAS)) {
      body.push(this.parseStatement());
    }

    this.consume(TokenType.FIN_MIENTRAS, "Se esperaba 'FIN_MIENTRAS' al cerrar el bucle");

    return {
      type: 'While',
      condition,
      body,
      pos: { line: whileToken.line, column: whileToken.column },
    };
  }

  private parseRepeatUntil(): RepeatUntilNode {
    const repeatToken = this.consume(TokenType.REPETIR, "Se esperaba 'REPETIR'");

    const body: ASTNode[] = [];
    while (!this.isAtEnd() && !this.check(TokenType.HASTA)) {
      body.push(this.parseStatement());
    }

    const untilToken = this.consume(
      TokenType.HASTA,
      "Se esperaba 'HASTA QUE' o 'HastaQue' al cerrar el bloque REPETIR"
    );
    if (untilToken.value !== 'HASTAQUE') {
      this.consume(TokenType.QUE, "Se esperaba 'QUE' después de 'HASTA' en REPETIR");
    }
    const condition = this.parseExpression();

    return {
      type: 'RepeatUntil',
      condition,
      body,
      pos: { line: repeatToken.line, column: repeatToken.column },
    };
  }

  private parseFor(): ForNode {
    const forToken = this.consume(TokenType.PARA, "Se esperaba 'PARA'");
    const varToken = this.consume(
      TokenType.IDENTIFICADOR,
      'Se esperaba variable para el bucle PARA'
    );

    this.consume(TokenType.ASIGNAR, "Se esperaba '=' en el inicio del bucle PARA");
    const startExpr = this.parseExpression();

    this.consume(TokenType.HASTA, "Se esperaba 'HASTA' en el bucle PARA");
    const endExpr = this.parseExpression();

    let stepExpr: ExpressionNode | undefined = undefined;
    if (this.check(TokenType.PASO)) {
      this.advance();
      stepExpr = this.parseExpression();
    }

    this.consume(TokenType.HACER, "Se esperaba 'HACER' antes del cuerpo de PARA");

    const body: ASTNode[] = [];
    while (!this.isAtEnd() && !this.isForEnd()) {
      body.push(this.parseStatement());
    }

    this.consumeForEnd();

    return {
      type: 'For',
      identifier: varToken.value,
      startExpr,
      endExpr,
      stepExpr,
      body,
      pos: { line: forToken.line, column: forToken.column },
    };
  }

  private isForEnd(): boolean {
    return (
      this.check(TokenType.FIN_PARA) ||
      (this.check(TokenType.IDENTIFICADOR) &&
        this.peek().value.toUpperCase() === 'FIN_' &&
        this.peekNext().type === TokenType.PARA)
    );
  }

  private consumeForEnd(): void {
    if (this.check(TokenType.FIN_PARA)) {
      this.advance();
      return;
    }

    if (this.check(TokenType.IDENTIFICADOR) && this.peek().value.toUpperCase() === 'FIN_') {
      this.advance();
      this.consume(TokenType.PARA, "Se esperaba 'PARA' después de 'FIN_' al cerrar el bucle PARA");
      return;
    }

    const token = this.peek();
    throw new ParserError(
      "Se esperaba 'FIN_PARA', 'FINPARA' o 'FIN_ PARA' al cerrar el bucle PARA",
      token.line,
      token.column
    );
  }

  private parsePause(): PauseNode {
    const pauseToken = this.consume(TokenType.PAUSAR, "Se esperaba 'PAUSAR'");
    this.consume(TokenType.LPAREN, "Se esperaba '(' después de PAUSAR");
    const msExpr = this.parseExpression();
    this.consume(TokenType.RPAREN, "Se esperaba ')' al cerrar PAUSAR");

    return {
      type: 'Pause',
      msExpr,
      pos: { line: pauseToken.line, column: pauseToken.column },
    };
  }

  private parseCanvasCommand(): CanvasNode {
    const token = this.advance();
    const commandByToken: Partial<Record<TokenType, CanvasNode['command']>> = {
      [TokenType.DIBUJAR_CIRCULO]: 'DIBUJAR_CIRCULO',
      [TokenType.DIBUJAR_RECTANGULO]: 'DIBUJAR_RECTANGULO',
      [TokenType.DIBUJAR_LINEA]: 'DIBUJAR_LINEA',
      [TokenType.LIMPIAR_CANVAS]: 'LIMPIAR_CANVAS',
      [TokenType.COLOR_PINCEL]: 'COLOR_PINCEL',
    };
    const command = commandByToken[token.type]!;
    const args: ExpressionNode[] = [];

    this.consume(TokenType.LPAREN, `Se esperaba '(' después de ${command}`);

    if (!this.check(TokenType.RPAREN)) {
      do {
        args.push(this.parseExpression());
        if (this.check(TokenType.COMMA)) {
          this.advance();
        } else {
          break;
        }
      } while (!this.isAtEnd());
    }

    this.consume(TokenType.RPAREN, `Se esperaba ')' al cerrar ${command}`);

    return {
      type: 'CanvasCommand',
      command,
      args,
      pos: { line: token.line, column: token.column },
    };
  }

  private parseSoundCommand(): SoundNode {
    const token = this.consume(TokenType.TOCAR_NOTA, "Se esperaba 'TOCAR_NOTA'");
    this.consume(TokenType.LPAREN, "Se esperaba '(' después de TOCAR_NOTA");

    const noteExpr = this.parseExpression();
    let durationExpr: ExpressionNode | undefined = undefined;

    if (this.check(TokenType.COMMA)) {
      this.advance();
      durationExpr = this.parseExpression();
    }

    this.consume(TokenType.RPAREN, "Se esperaba ')' al cerrar TOCAR_NOTA");

    return {
      type: 'SoundCommand',
      noteExpr,
      durationExpr,
      pos: { line: token.line, column: token.column },
    };
  }

  // --- Expressions Parsing (Precedence Cascade) ---

  private parseExpression(): ExpressionNode {
    return this.parseLogicalOr();
  }

  private parseLogicalOr(): ExpressionNode {
    let expr = this.parseLogicalAnd();

    while (this.check(TokenType.O)) {
      const opToken = this.advance();
      const right = this.parseLogicalAnd();
      expr = {
        type: 'Binary',
        operator: 'O',
        left: expr,
        right,
        pos: { line: opToken.line, column: opToken.column },
      };
    }

    return expr;
  }

  private parseLogicalAnd(): ExpressionNode {
    let expr = this.parseEquality();

    while (this.check(TokenType.Y)) {
      const opToken = this.advance();
      const right = this.parseEquality();
      expr = {
        type: 'Binary',
        operator: 'Y',
        left: expr,
        right,
        pos: { line: opToken.line, column: opToken.column },
      };
    }

    return expr;
  }

  private parseEquality(): ExpressionNode {
    let expr = this.parseComparison();

    while (this.check(TokenType.IGUAL) || this.check(TokenType.DIFERENTE)) {
      const opToken = this.advance();
      const right = this.parseComparison();
      expr = {
        type: 'Binary',
        operator: opToken.type === TokenType.IGUAL ? '==' : '!=',
        left: expr,
        right,
        pos: { line: opToken.line, column: opToken.column },
      };
    }

    return expr;
  }

  private parseComparison(): ExpressionNode {
    let expr = this.parseTerm();

    while (
      this.check(TokenType.MENOR) ||
      this.check(TokenType.MAYOR) ||
      this.check(TokenType.MENOR_IGUAL) ||
      this.check(TokenType.MAYOR_IGUAL)
    ) {
      const opToken = this.advance();
      const right = this.parseTerm();
      expr = {
        type: 'Binary',
        operator: opToken.value,
        left: expr,
        right,
        pos: { line: opToken.line, column: opToken.column },
      };
    }

    return expr;
  }

  private parseTerm(): ExpressionNode {
    let expr = this.parseFactor();

    while (this.check(TokenType.SUMA) || this.check(TokenType.RESTA)) {
      const opToken = this.advance();
      const right = this.parseFactor();
      expr = {
        type: 'Binary',
        operator: opToken.value,
        left: expr,
        right,
        pos: { line: opToken.line, column: opToken.column },
      };
    }

    return expr;
  }

  private parseFactor(): ExpressionNode {
    let expr = this.parseUnary();

    while (
      this.check(TokenType.MULTIPLICACION) ||
      this.check(TokenType.DIVISION) ||
      this.check(TokenType.MODULO) ||
      this.check(TokenType.POTENCIA)
    ) {
      const opToken = this.advance();
      const right = this.parseUnary();
      expr = {
        type: 'Binary',
        operator: opToken.value,
        left: expr,
        right,
        pos: { line: opToken.line, column: opToken.column },
      };
    }

    return expr;
  }

  private parseUnary(): ExpressionNode {
    if (this.check(TokenType.RESTA) || this.check(TokenType.NO)) {
      const opToken = this.advance();
      const operand = this.parseUnary();
      return {
        type: 'Unary',
        operator: opToken.value,
        operand,
        pos: { line: opToken.line, column: opToken.column },
      };
    }

    return this.parsePrimary();
  }

  private parsePrimary(): ExpressionNode {
    const token = this.peek();

    if (token.type === TokenType.NUMERO) {
      this.advance();
      const isFloat = token.value.includes('.');
      return {
        type: 'Literal',
        value: isFloat ? parseFloat(token.value) : parseInt(token.value, 10),
        literalType: isFloat ? 'DECIMAL' : 'ENTERO',
        pos: { line: token.line, column: token.column },
      };
    }

    if (token.type === TokenType.CADENA) {
      this.advance();
      return {
        type: 'Literal',
        value: token.value,
        literalType: 'CADENA',
        pos: { line: token.line, column: token.column },
      };
    }

    if (token.type === TokenType.BOOLEANO) {
      this.advance();
      return {
        type: 'Literal',
        value: token.value === 'VERDADERO' || token.value === 'VERDAD',
        literalType: 'LOGICO',
        pos: { line: token.line, column: token.column },
      };
    }

    // Array literal e.g. [1, 2, 3]
    if (token.type === TokenType.LBRACKET) {
      const bracketToken = this.advance();
      const elements: ExpressionNode[] = [];
      if (!this.check(TokenType.RBRACKET)) {
        do {
          elements.push(this.parseExpression());
          if (this.check(TokenType.COMMA)) this.advance();
          else break;
        } while (!this.isAtEnd());
      }
      this.consume(TokenType.RBRACKET, "Se esperaba ']' al cerrar la lista/arreglo");
      return {
        type: 'Literal',
        value: elements,
        literalType: 'ARRAY',
        pos: { line: bracketToken.line, column: bracketToken.column },
      };
    }

    // Function calls or Variables
    if (token.type === TokenType.IDENTIFICADOR) {
      this.advance();

      // Check function call e.g. ALEATORIO(1, 10)
      if (this.check(TokenType.LPAREN)) {
        this.advance();
        const args: ExpressionNode[] = [];
        if (!this.check(TokenType.RPAREN)) {
          do {
            args.push(this.parseExpression());
            if (this.check(TokenType.COMMA)) this.advance();
            else break;
          } while (!this.isAtEnd());
        }
        this.consume(TokenType.RPAREN, `Se esperaba ')' al cerrar la función ${token.value}`);
        return {
          type: 'FunctionCall',
          name: token.value,
          args,
          pos: { line: token.line, column: token.column },
        };
      }

      // Check array indexing e.g. miLista[0]
      if (this.check(TokenType.LBRACKET)) {
        const indexExprs = this.parseIndexExpressions();
        return {
          type: 'ArrayAccess',
          arrayName: token.value,
          indexExpr: indexExprs[0],
          indexExprs,
          pos: { line: token.line, column: token.column },
        };
      }

      // Check property access e.g. alumno.nombre
      if (this.check(TokenType.DOT)) {
        this.advance();
        const propertyToken = this.consume(
          TokenType.IDENTIFICADOR,
          "Se esperaba el nombre del campo después de '.'"
        );
        return {
          type: 'PropertyAccess',
          objectName: token.value,
          propertyName: propertyToken.value,
          pos: { line: token.line, column: token.column },
        };
      }

      return {
        type: 'Variable',
        name: token.value,
        pos: { line: token.line, column: token.column },
      };
    }

    // Parenthesized expression
    if (token.type === TokenType.LPAREN) {
      this.advance();
      const expr = this.parseExpression();
      this.consume(TokenType.RPAREN, "Se esperaba ')' al cerrar la expresión entre paréntesis");
      return expr;
    }

    throw new ParserError(`Expresión o valor no válido '${token.value}'`, token.line, token.column);
  }

  private consume(type: TokenType, errorMessage: string): Token {
    if (this.check(type)) return this.advance();
    const currentToken = this.peek();
    throw new ParserError(errorMessage, currentToken.line, currentToken.column);
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private peekNext(): Token {
    return this.tokens[this.current + 1] ?? this.tokens[this.tokens.length - 1];
  }
}
