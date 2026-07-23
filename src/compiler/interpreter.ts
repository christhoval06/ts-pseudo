import {
  ProgramNode,
  ASTNode,
  ExpressionNode,
  TypeDeclarationNode,
  ProcedureNode,
  VarDeclarationNode,
  AssignmentNode,
  PrintNode,
  ReadNode,
  IfNode,
  WhileNode,
  RepeatUntilNode,
  ForNode,
  PauseNode,
  CanvasNode,
  SoundNode,
  Position,
  FunctionCallNode,
  ExpressionStatementNode,
} from './ast';

export interface VariableState {
  name: string;
  type: string;
  value: unknown;
  isConstant?: boolean;
}

export interface InterpreterCallbacks {
  onPrint: (message: string) => void;
  onRead: (prompt: string, callback: (input: string) => void) => void;
  onCanvas: (command: string, args: unknown[]) => void;
  onSound: (note: string | number, duration: number) => void;
  onStep: (pos?: Position) => Promise<void>;
  onVariableUpdate: (vars: Map<string, VariableState>) => void;
  onError: (error: string) => void;
  onFinished: () => void;
}

export class InterpreterError extends Error {
  constructor(
    message: string,
    public pos?: Position
  ) {
    super(
      pos
        ? `Error de Ejecución [Línea ${pos.line}, Columna ${pos.column}]: ${message}`
        : `Error de Ejecución: ${message}`
    );
    this.name = 'InterpreterError';
  }
}

export class Interpreter {
  private variables: Map<string, VariableState> = new Map();
  private typeDeclarations: Map<string, TypeDeclarationNode> = new Map();
  private procedures: Map<string, ProcedureNode> = new Map();
  private isStopped: boolean = false;
  private callbacks: InterpreterCallbacks;

  constructor(callbacks: InterpreterCallbacks) {
    this.callbacks = callbacks;
  }

  public stop(): void {
    this.isStopped = true;
  }

  public async execute(program: ProgramNode): Promise<void> {
    this.variables.clear();
    this.typeDeclarations.clear();
    this.procedures.clear();
    this.isStopped = false;

    try {
      for (const stmt of program.body) {
        if (stmt.type === 'Procedure') {
          this.procedures.set(stmt.name.toUpperCase(), stmt);
        }
      }

      for (const stmt of program.body) {
        if (this.isStopped) break;
        if (stmt.type === 'Procedure') continue;
        await this.executeStatement(stmt);
      }
      if (!this.isStopped) {
        this.callbacks.onFinished();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.callbacks.onError(msg);
    }
  }

  private async executeStatement(node: ASTNode): Promise<void> {
    if (this.isStopped) return;

    // Highlight current line step
    if ('pos' in node && node.pos) {
      await this.callbacks.onStep(node.pos);
    }

    switch (node.type) {
      case 'TypeDeclaration':
        await this.executeTypeDeclaration(node);
        break;

      case 'Procedure':
        break;

      case 'VarDeclaration':
        await this.executeVarDeclaration(node);
        break;

      case 'Assignment':
        await this.executeAssignment(node);
        break;

      case 'ExpressionStatement':
        await this.executeExpressionStatement(node);
        break;

      case 'Print':
        await this.executePrint(node);
        break;

      case 'Read':
        await this.executeRead(node);
        break;

      case 'If':
        await this.executeIf(node);
        break;

      case 'While':
        await this.executeWhile(node);
        break;

      case 'RepeatUntil':
        await this.executeRepeatUntil(node);
        break;

      case 'For':
        await this.executeFor(node);
        break;

      case 'Pause':
        await this.executePause(node);
        break;

      case 'CanvasCommand':
        await this.executeCanvas(node);
        break;

      case 'SoundCommand':
        await this.executeSound(node);
        break;

      default:
        break;
    }

    this.callbacks.onVariableUpdate(new Map(this.variables));
  }

  private async executeTypeDeclaration(node: TypeDeclarationNode): Promise<void> {
    this.typeDeclarations.set(node.name, node);
  }

  private async executeVarDeclaration(node: VarDeclarationNode): Promise<void> {
    let initialValue: unknown = undefined;

    if (node.value) {
      initialValue = await this.evaluateExpression(node.value);
    } else if (node.dimensions) {
      initialValue = await this.createSizedArrayValue(node.varType, node.dimensions, node.pos);
    } else if (this.typeDeclarations.has(node.varType)) {
      initialValue = this.createDefaultStructValue(node.varType);
    } else {
      // Default value by type
      switch (node.varType.toUpperCase()) {
        case 'ENTERO':
        case 'ENETRO':
        case 'DECIMAL':
        case 'REAL':
          initialValue = 0;
          break;
        case 'BOOLEANO':
        case 'LOGICO':
          initialValue = false;
          break;
        case 'CADENA':
        case 'TEXTO':
          initialValue = '';
          break;
        case 'ARRAY':
        case 'MATRIZ':
        case 'LISTA':
          initialValue = [];
          break;
        default:
          initialValue = 0;
      }
    }

    this.variables.set(node.identifier, {
      name: node.identifier,
      type: node.varType,
      value: initialValue,
      isConstant: node.isConstant,
    });
  }

  private async executeAssignment(node: AssignmentNode): Promise<void> {
    const rhsValue = await this.evaluateExpression(node.value);

    if (node.propertyName) {
      const varInfo = this.variables.get(node.identifier);
      if (!varInfo) {
        throw new InterpreterError(`Variable '${node.identifier}' no declarada`, node.pos);
      }
      this.assertMutable(varInfo, node.pos);
      if (!this.isRecord(varInfo.value)) {
        throw new InterpreterError(`'${node.identifier}' no es un registro/TIPO`, node.pos);
      }
      varInfo.value[node.propertyName] = rhsValue;
    } else if (node.indexExpr) {
      const varInfo = this.variables.get(node.identifier);
      if (!varInfo) {
        throw new InterpreterError(`Variable '${node.identifier}' no declarada`, node.pos);
      }
      this.assertMutable(varInfo, node.pos);
      if (!Array.isArray(varInfo.value)) {
        throw new InterpreterError(`'${node.identifier}' no es una lista/arreglo`, node.pos);
      }
      const indexes = await this.evaluateIndexExpressions(
        node.indexExprs ?? [node.indexExpr],
        node.pos
      );
      this.assignIndexedValue(varInfo.value, indexes, rhsValue, node.pos);
    } else {
      const existing = this.variables.get(node.identifier);
      if (!existing) {
        throw new InterpreterError(`Variable '${node.identifier}' no declarada`, node.pos);
      }
      this.assertMutable(existing, node.pos);

      this.variables.set(node.identifier, {
        name: node.identifier,
        type: existing.type,
        value: rhsValue,
        isConstant: existing.isConstant,
      });
    }
  }

  private async executeExpressionStatement(node: ExpressionStatementNode): Promise<void> {
    await this.evaluateExpression(node.expression);
  }

  private async executePrint(node: PrintNode): Promise<void> {
    const outputs: string[] = [];

    for (const expr of node.expressions) {
      const val = await this.evaluateExpression(expr);
      outputs.push(this.formatValue(val));
    }

    this.callbacks.onPrint(outputs.join(' '));
  }

  private async executeRead(node: ReadNode): Promise<void> {
    const promptText = node.prompt || `Ingresa un valor para '${node.identifier}':`;

    return new Promise((resolve) => {
      this.callbacks.onRead(promptText, (userInput: string) => {
        if (this.isStopped) return resolve();

        // Convert user input to number if numeric, else boolean/string
        let parsedVal: unknown = userInput;
        if (/^-?\d+$/.test(userInput)) {
          parsedVal = parseInt(userInput, 10);
        } else if (/^-?\d+\.\d+$/.test(userInput)) {
          parsedVal = parseFloat(userInput);
        } else if (userInput.toUpperCase() === 'VERDADERO') {
          parsedVal = true;
        } else if (userInput.toUpperCase() === 'FALSO') {
          parsedVal = false;
        }

        const existing = this.variables.get(node.identifier);
        if (existing) {
          this.assertMutable(existing, node.pos);
        }
        this.variables.set(node.identifier, {
          name: node.identifier,
          type: existing ? existing.type : 'CADENA',
          value: parsedVal,
        });

        resolve();
      });
    });
  }

  private async executeIf(node: IfNode): Promise<void> {
    const condVal = await this.evaluateExpression(node.condition);

    if (this.isTruthy(condVal)) {
      for (const stmt of node.thenBranch) {
        if (this.isStopped) break;
        await this.executeStatement(stmt);
      }
    } else if (node.elseBranch) {
      for (const stmt of node.elseBranch) {
        if (this.isStopped) break;
        await this.executeStatement(stmt);
      }
    }
  }

  private async executeWhile(node: WhileNode): Promise<void> {
    let iterations = 0;
    const maxIterations = 10000; // Protection against infinite loops

    while (this.isTruthy(await this.evaluateExpression(node.condition))) {
      if (this.isStopped) break;
      iterations++;

      if (iterations > maxIterations) {
        throw new InterpreterError(
          'Bucle infinito detectado (más de 10,000 iteraciones)',
          node.pos
        );
      }

      for (const stmt of node.body) {
        if (this.isStopped) break;
        await this.executeStatement(stmt);
      }
    }
  }

  private async executeRepeatUntil(node: RepeatUntilNode): Promise<void> {
    let iterations = 0;
    const maxIterations = 10000;

    do {
      if (this.isStopped) break;
      iterations++;

      if (iterations > maxIterations) {
        throw new InterpreterError(
          'Bucle REPETIR demasiado largo o infinito (más de 10,000 iteraciones)',
          node.pos
        );
      }

      for (const stmt of node.body) {
        if (this.isStopped) break;
        await this.executeStatement(stmt);
      }
    } while (!this.isTruthy(await this.evaluateExpression(node.condition)));
  }

  private async executeFor(node: ForNode): Promise<void> {
    const startVal = await this.evaluateExpression(node.startExpr);
    const endVal = await this.evaluateExpression(node.endExpr);
    const stepVal = node.stepExpr ? await this.evaluateExpression(node.stepExpr) : 1;
    const existingLoopVariable = this.variables.get(node.identifier);
    if (existingLoopVariable) {
      this.assertMutable(existingLoopVariable, node.pos);
    }

    if (typeof startVal !== 'number' || typeof endVal !== 'number') {
      throw new InterpreterError(
        'El bucle PARA requiere valores numéricos de inicio y fin',
        node.pos
      );
    }
    const stepNum = typeof stepVal === 'number' ? stepVal : 1;

    this.variables.set(node.identifier, {
      name: node.identifier,
      type: 'ENTERO',
      value: startVal,
    });

    let currentVal = startVal;
    let iterations = 0;
    const maxIterations = 10000;

    const conditionCheck = () => (stepNum >= 0 ? currentVal <= endVal : currentVal >= endVal);

    while (conditionCheck()) {
      if (this.isStopped) break;
      iterations++;
      if (iterations > maxIterations) {
        throw new InterpreterError('Bucle PARA demasiado largo o infinito', node.pos);
      }

      for (const stmt of node.body) {
        if (this.isStopped) break;
        await this.executeStatement(stmt);
      }

      currentVal += stepNum;
      this.variables.set(node.identifier, {
        name: node.identifier,
        type: 'ENTERO',
        value: currentVal,
      });
    }
  }

  private async executePause(node: PauseNode): Promise<void> {
    const ms = await this.evaluateExpression(node.msExpr);
    const duration = typeof ms === 'number' ? ms : 500;
    await new Promise((res) => setTimeout(res, duration));
  }

  private async executeCanvas(node: CanvasNode): Promise<void> {
    const evaluatedArgs: unknown[] = [];
    for (const arg of node.args) {
      evaluatedArgs.push(await this.evaluateExpression(arg));
    }
    this.callbacks.onCanvas(node.command, evaluatedArgs);
  }

  private async executeSound(node: SoundNode): Promise<void> {
    const note = await this.evaluateExpression(node.noteExpr);
    const dur = node.durationExpr ? await this.evaluateExpression(node.durationExpr) : 400;
    const noteVal = typeof note === 'number' || typeof note === 'string' ? note : 440;
    const durVal = typeof dur === 'number' ? dur : 400;
    this.callbacks.onSound(noteVal, durVal);
  }

  // --- Expression Evaluator ---

  private async evaluateExpression(node: ExpressionNode): Promise<unknown> {
    switch (node.type) {
      case 'Literal':
        if (node.literalType === 'ARRAY' && Array.isArray(node.value)) {
          const evaluatedArr: unknown[] = [];
          for (const item of node.value) {
            evaluatedArr.push(await this.evaluateExpression(item as ExpressionNode));
          }
          return evaluatedArr;
        }
        return node.value;

      case 'Variable': {
        const varInfo = this.variables.get(node.name);
        if (!varInfo) {
          throw new InterpreterError(`La variable '${node.name}' no está definida`, node.pos);
        }
        return varInfo.value;
      }

      case 'PropertyAccess': {
        const varInfo = this.variables.get(node.objectName);
        if (!varInfo) {
          throw new InterpreterError(`La variable '${node.objectName}' no está definida`, node.pos);
        }
        if (!this.isRecord(varInfo.value)) {
          throw new InterpreterError(`'${node.objectName}' no es un registro/TIPO`, node.pos);
        }
        return varInfo.value[node.propertyName];
      }

      case 'ArrayAccess': {
        const varInfo = this.variables.get(node.arrayName);
        if (!varInfo) {
          throw new InterpreterError(`El arreglo '${node.arrayName}' no está definido`, node.pos);
        }
        if (!Array.isArray(varInfo.value)) {
          throw new InterpreterError(`'${node.arrayName}' no es una lista/arreglo`, node.pos);
        }
        const indexes = await this.evaluateIndexExpressions(
          node.indexExprs ?? [node.indexExpr],
          node.pos
        );
        return this.getIndexedValue(varInfo.value, indexes, node.arrayName, node.pos);
      }

      case 'Binary': {
        const left = await this.evaluateExpression(node.left);
        const right = await this.evaluateExpression(node.right);

        switch (node.operator) {
          case '+':
            if (typeof left === 'string' || typeof right === 'string') {
              return String(left) + String(right);
            }
            return (left as number) + (right as number);
          case '-':
            return (left as number) - (right as number);
          case '*':
            return (left as number) * (right as number);
          case '/':
            if (right === 0) throw new InterpreterError('División por cero no permitida', node.pos);
            return (left as number) / (right as number);
          case '%':
            return (left as number) % (right as number);
          case '^':
            return Math.pow(left as number, right as number);

          case '==':
            return left === right;
          case '!=':
            return left !== right;
          case '<':
            return (left as number) < (right as number);
          case '>':
            return (left as number) > (right as number);
          case '<=':
            return (left as number) <= (right as number);
          case '>=':
            return (left as number) >= (right as number);

          case 'Y':
            return this.isTruthy(left) && this.isTruthy(right);
          case 'O':
            return this.isTruthy(left) || this.isTruthy(right);

          default:
            throw new InterpreterError(`Operador binario desconocido '${node.operator}'`, node.pos);
        }
      }

      case 'Unary': {
        const operand = await this.evaluateExpression(node.operand);
        if (node.operator === '-') return -(operand as number);
        if (node.operator === 'NO') return !this.isTruthy(operand);
        throw new InterpreterError(`Operador unario desconocido '${node.operator}'`, node.pos);
      }

      case 'FunctionCall':
        return await this.evaluateFunctionCall(node);
    }
  }

  private async evaluateFunctionCall(node: FunctionCallNode): Promise<unknown> {
    const fnName = node.name.toUpperCase();
    const args: unknown[] = [];
    for (const arg of node.args) {
      args.push(await this.evaluateExpression(arg));
    }

    switch (fnName) {
      case 'ALEATORIO': {
        const min = typeof args[0] === 'number' ? args[0] : 1;
        const max = typeof args[1] === 'number' ? args[1] : 100;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      case 'LONGITUD': {
        const target = args[0];
        if (typeof target === 'string' || Array.isArray(target)) return target.length;
        return 0;
      }
      case 'RAIZ':
        return Math.sqrt(typeof args[0] === 'number' ? args[0] : 0);
      case 'ABS':
        return Math.abs(typeof args[0] === 'number' ? args[0] : 0);
      case 'MAYUSCULAS':
        return String(args[0] ?? '').toUpperCase();
      case 'MINUSCULAS':
        return String(args[0] ?? '').toLowerCase();
      default:
        if (this.procedures.has(fnName)) {
          await this.executeProcedureCall(this.procedures.get(fnName)!, args, node.pos);
          return undefined;
        }
        throw new InterpreterError(`Función desconocida '${node.name}'`, node.pos);
    }
  }

  private async executeProcedureCall(
    procedure: ProcedureNode,
    args: unknown[],
    pos?: Position
  ): Promise<void> {
    if (args.length !== procedure.params.length) {
      throw new InterpreterError(
        `El proceso '${procedure.name}' esperaba ${procedure.params.length} argumento(s), pero recibió ${args.length}`,
        pos
      );
    }

    const previousParams = new Map<string, VariableState | undefined>();
    const existingNames = new Set(this.variables.keys());

    for (let i = 0; i < procedure.params.length; i++) {
      const param = procedure.params[i];
      previousParams.set(param.name, this.variables.get(param.name));
      this.variables.set(param.name, {
        name: param.name,
        type: param.paramType,
        value: args[i],
      });
    }

    try {
      for (const stmt of procedure.body) {
        if (this.isStopped) break;
        await this.executeStatement(stmt);
      }
    } finally {
      for (const name of Array.from(this.variables.keys())) {
        if (!existingNames.has(name)) {
          this.variables.delete(name);
        }
      }

      for (const [name, previous] of previousParams) {
        if (previous) {
          this.variables.set(name, previous);
        } else {
          this.variables.delete(name);
        }
      }
    }
  }

  private isTruthy(val: unknown): boolean {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val !== 0;
    if (typeof val === 'string') return val.length > 0;
    if (Array.isArray(val)) return val.length > 0;
    return Boolean(val);
  }

  private formatValue(val: unknown): string {
    if (val === true) return 'VERDADERO';
    if (val === false) return 'FALSO';
    if (Array.isArray(val)) return `[${val.map((v) => this.formatValue(v)).join(', ')}]`;
    if (this.isRecord(val)) return JSON.stringify(val);
    return String(val);
  }

  private async createSizedArrayValue(
    typeName: string,
    dimensions: ExpressionNode[],
    pos?: Position
  ): Promise<unknown[]> {
    const sizes = await this.evaluateIndexExpressions(dimensions, pos);
    if (sizes.length === 0 || sizes.length > 2) {
      throw new InterpreterError('Solo se permiten arreglos de 1 dimensión o matrices de 2 dimensiones', pos);
    }

    const [rows, cols] = sizes;
    if (cols === undefined) {
      return Array.from({ length: rows }, () => this.cloneDefaultValue(typeName));
    }

    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => this.cloneDefaultValue(typeName))
    );
  }

  private createDefaultStructValue(typeName: string): Record<string, unknown> {
    const typeDeclaration = this.typeDeclarations.get(typeName);
    if (!typeDeclaration) return {};

    const value: Record<string, unknown> = {};
    for (const field of typeDeclaration.fields) {
      value[field.name] = this.createDefaultValue(field.fieldType);
    }
    return value;
  }

  private createDefaultValue(typeName: string): unknown {
    switch (typeName.toUpperCase()) {
      case 'ENTERO':
      case 'ENETRO':
      case 'DECIMAL':
      case 'REAL':
        return 0;
      case 'BOOLEANO':
      case 'LOGICO':
        return false;
      case 'CADENA':
      case 'TEXTO':
        return '';
      case 'ARRAY':
      case 'MATRIZ':
      case 'LISTA':
        return [];
      default:
        return this.typeDeclarations.has(typeName)
          ? this.createDefaultStructValue(typeName)
          : undefined;
    }
  }

  private cloneDefaultValue(typeName: string): unknown {
    const value = this.createDefaultValue(typeName);
    if (Array.isArray(value)) return [...value];
    if (this.isRecord(value)) return { ...value };
    return value;
  }

  private async evaluateIndexExpressions(
    expressions: ExpressionNode[],
    pos?: Position
  ): Promise<number[]> {
    const indexes: number[] = [];

    for (const expr of expressions) {
      const value = await this.evaluateExpression(expr);
      if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
        throw new InterpreterError(`Índice de arreglo no válido: ${String(value)}`, pos);
      }
      indexes.push(value);
    }

    return indexes;
  }

  private assignIndexedValue(
    target: unknown[],
    indexes: number[],
    value: unknown,
    pos?: Position
  ): void {
    if (indexes.length === 1) {
      target[indexes[0]] = value;
      return;
    }

    if (indexes.length === 2) {
      const row = target[indexes[0]];
      if (!Array.isArray(row)) {
        throw new InterpreterError(`La fila ${indexes[0]} no existe o no es una lista`, pos);
      }
      row[indexes[1]] = value;
      return;
    }

    throw new InterpreterError('Solo se permiten índices de 1 o 2 dimensiones', pos);
  }

  private getIndexedValue(
    target: unknown[],
    indexes: number[],
    arrayName: string,
    pos?: Position
  ): unknown {
    if (indexes.length === 1) {
      this.assertInRange(target, indexes[0], arrayName, pos);
      return target[indexes[0]];
    }

    if (indexes.length === 2) {
      this.assertInRange(target, indexes[0], arrayName, pos);
      const row = target[indexes[0]];
      if (!Array.isArray(row)) {
        throw new InterpreterError(`'${arrayName}' no es una matriz`, pos);
      }
      this.assertInRange(row, indexes[1], `${arrayName}[${indexes[0]}]`, pos);
      return row[indexes[1]];
    }

    throw new InterpreterError('Solo se permiten índices de 1 o 2 dimensiones', pos);
  }

  private assertInRange(target: unknown[], index: number, name: string, pos?: Position): void {
    if (index >= target.length) {
      throw new InterpreterError(
        `Índice ${index} fuera de rango para '${name}' (Longitud: ${target.length})`,
        pos
      );
    }
  }

  private assertMutable(variable: VariableState, pos?: Position): void {
    if (variable.isConstant) {
      throw new InterpreterError(`No se puede cambiar la constante '${variable.name}'`, pos);
    }
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
