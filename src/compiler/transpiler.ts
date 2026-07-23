import { ProgramNode, ASTNode, ExpressionNode } from './ast';

export class Transpiler {
  private typeDeclarations: Map<string, { name: string; fieldType: string }[]> = new Map();

  public transpile(program: ProgramNode): string {
    this.typeDeclarations.clear();
    let code = '// Código generado automáticamente en TypeScript / JavaScript\n';
    code += '// ts-pseudo Compiler Target: ES2022 / TypeScript\n\n';

    for (const stmt of program.body) {
      code += this.transpileStatement(stmt, 0) + '\n';
    }

    return code;
  }

  private transpileStatement(node: ASTNode, indentLevel: number): string {
    const indent = '  '.repeat(indentLevel);

    switch (node.type) {
      case 'TypeDeclaration': {
        this.typeDeclarations.set(node.name, node.fields);
        let out = `${indent}interface ${node.name} {\n`;
        for (const field of node.fields) {
          out += `${indent}  ${field.name}: ${this.mapTypeToTS(field.fieldType)};\n`;
        }
        out += `${indent}}`;
        return out;
      }

      case 'Procedure': {
        const params = node.params
          .map((param) => `${param.name}: ${this.mapTypeToTS(param.paramType)}`)
          .join(', ');
        let out = `${indent}function ${node.name}(${params}): void {\n`;
        for (const s of node.body) {
          out += this.transpileStatement(s, indentLevel + 1) + '\n';
        }
        out += `${indent}}`;
        return out;
      }

      case 'VarDeclaration': {
        const tsType = node.dimensions
          ? this.mapDimensionsToTS(node.varType, node.dimensions.length)
          : this.mapTypeToTS(node.varType);
        const valStr = node.value
          ? ` = ${this.transpileExpression(node.value)}`
          : node.dimensions
            ? ` = ${this.transpileSizedArrayValue(node.varType, node.dimensions)}`
          : this.typeDeclarations.has(node.varType)
            ? ` = ${this.transpileDefaultValue(node.varType)}`
            : '';
        const declarationKeyword = node.isConstant ? 'const' : 'let';
        return `${indent}${declarationKeyword} ${node.identifier}: ${tsType}${valStr};`;
      }

      case 'Assignment': {
        const valStr = this.transpileExpression(node.value);
        if (node.propertyName) {
          return `${indent}${node.identifier}.${node.propertyName} = ${valStr};`;
        }
        if (node.indexExpr) {
          const indexStr = this.transpileIndexExpressions(node.indexExprs ?? [node.indexExpr]);
          return `${indent}${node.identifier}${indexStr} = ${valStr};`;
        }
        return `${indent}${node.identifier} = ${valStr};`;
      }

      case 'ExpressionStatement': {
        return `${indent}${this.transpileExpression(node.expression)};`;
      }

      case 'Print': {
        const exprs = node.expressions.map((e) => this.transpileExpression(e)).join(', ');
        return `${indent}console.log(${exprs});`;
      }

      case 'Read': {
        const prompt = node.prompt ? JSON.stringify(node.prompt) : `Prompt`;
        return `${indent}${node.identifier} = prompt(${prompt});`;
      }

      case 'If': {
        const cond = this.transpileExpression(node.condition);
        let out = `${indent}if (${cond}) {\n`;
        for (const s of node.thenBranch) {
          out += this.transpileStatement(s, indentLevel + 1) + '\n';
        }
        if (node.elseBranch) {
          if (node.elseBranch.length === 1 && node.elseBranch[0].type === 'If') {
            out += `${indent}} else ${this.transpileStatement(node.elseBranch[0], indentLevel).trimStart()}`;
          } else {
            out += `${indent}} else {\n`;
            for (const s of node.elseBranch) {
              out += this.transpileStatement(s, indentLevel + 1) + '\n';
            }
          }
        }
        out += `${indent}}`;
        return out;
      }

      case 'While': {
        const cond = this.transpileExpression(node.condition);
        let out = `${indent}while (${cond}) {\n`;
        for (const s of node.body) {
          out += this.transpileStatement(s, indentLevel + 1) + '\n';
        }
        out += `${indent}}`;
        return out;
      }

      case 'RepeatUntil': {
        const cond = this.transpileExpression(node.condition);
        let out = `${indent}do {\n`;
        for (const s of node.body) {
          out += this.transpileStatement(s, indentLevel + 1) + '\n';
        }
        out += `${indent}} while (!(${cond}));`;
        return out;
      }

      case 'For': {
        const start = this.transpileExpression(node.startExpr);
        const end = this.transpileExpression(node.endExpr);
        const step = node.stepExpr ? this.transpileExpression(node.stepExpr) : '1';
        let out = `${indent}for (let ${node.identifier} = ${start}; ${node.identifier} <= ${end}; ${node.identifier} += ${step}) {\n`;
        for (const s of node.body) {
          out += this.transpileStatement(s, indentLevel + 1) + '\n';
        }
        out += `${indent}}`;
        return out;
      }

      case 'Pause': {
        const ms = this.transpileExpression(node.msExpr);
        return `${indent}await new Promise(resolve => setTimeout(resolve, ${ms}));`;
      }

      case 'CanvasCommand': {
        const args = node.args.map((a) => this.transpileExpression(a)).join(', ');
        return `${indent}dibujar.${node.command.toLowerCase()}(${args});`;
      }

      case 'SoundCommand': {
        const note = this.transpileExpression(node.noteExpr);
        const dur = node.durationExpr ? this.transpileExpression(node.durationExpr) : '400';
        return `${indent}tocarNota(${note}, ${dur});`;
      }

      default:
        return `${indent}// ${JSON.stringify(node)}`;
    }
  }

  private transpileExpression(node: ExpressionNode): string {
    switch (node.type) {
      case 'Literal':
        if (typeof node.value === 'boolean') return node.value ? 'true' : 'false';
        if (typeof node.value === 'string') return JSON.stringify(node.value);
        if (Array.isArray(node.value)) {
          return `[${node.value.map((v) => this.transpileExpression(v as ExpressionNode)).join(', ')}]`;
        }
        return String(node.value);

      case 'Variable':
        return node.name;

      case 'PropertyAccess':
        return `${node.objectName}.${node.propertyName}`;

      case 'ArrayAccess':
        return `${node.arrayName}${this.transpileIndexExpressions(node.indexExprs ?? [node.indexExpr])}`;

      case 'Binary': {
        let op = node.operator;
        if (op === 'Y') op = '&&';
        if (op === 'O') op = '||';
        if (op === '^')
          return `Math.pow(${this.transpileExpression(node.left)}, ${this.transpileExpression(node.right)})`;
        return `(${this.transpileExpression(node.left)} ${op} ${this.transpileExpression(node.right)})`;
      }

      case 'Unary': {
        let op = node.operator;
        if (op === 'NO') op = '!';
        return `${op}(${this.transpileExpression(node.operand)})`;
      }

      case 'FunctionCall': {
        const fn = node.name.toUpperCase();
        const args = node.args.map((a) => this.transpileExpression(a)).join(', ');
        if (fn === 'ALEATORIO') return `(Math.floor(Math.random() * (${args})) + 1)`;
        if (fn === 'LONGITUD') return `(${args}).length`;
        if (fn === 'RAIZ') return `Math.sqrt(${args})`;
        if (fn === 'ABS') return `Math.abs(${args})`;
        return `${node.name}(${args})`;
      }
    }

    return 'undefined';
  }

  private mapTypeToTS(typeStr: string): string {
    switch (typeStr.toUpperCase()) {
      case 'ENTERO':
      case 'ENETRO':
      case 'DECIMAL':
      case 'REAL':
        return 'number';
      case 'CADENA':
      case 'TEXTO':
        return 'string';
      case 'BOOLEANO':
      case 'LOGICO':
        return 'boolean';
      case 'ARRAY':
      case 'MATRIZ':
      case 'LISTA':
        return 'any[]';
      default:
        return typeStr;
    }
  }

  private mapDimensionsToTS(typeStr: string, dimensions: number): string {
    const baseType = this.mapTypeToTS(typeStr);
    return `${baseType}${'[]'.repeat(dimensions)}`;
  }

  private transpileIndexExpressions(indexExprs: ExpressionNode[]): string {
    return indexExprs.map((expr) => `[${this.transpileExpression(expr)}]`).join('');
  }

  private transpileSizedArrayValue(typeStr: string, dimensions: ExpressionNode[]): string {
    const sizes = dimensions.map((expr) => this.transpileExpression(expr));
    const defaultValue = this.transpilePrimitiveDefaultValue(typeStr);

    if (sizes.length === 1) {
      return `Array.from({ length: ${sizes[0]} }, () => ${defaultValue})`;
    }

    if (sizes.length === 2) {
      return `Array.from({ length: ${sizes[0]} }, () => Array.from({ length: ${sizes[1]} }, () => ${defaultValue}))`;
    }

    return '[]';
  }

  private transpileDefaultValue(typeStr: string): string {
    const fields = this.typeDeclarations.get(typeStr);
    if (!fields) return 'undefined';

    const defaults = fields.map(
      (field) => `${field.name}: ${this.transpilePrimitiveDefaultValue(field.fieldType)}`
    );
    return `{ ${defaults.join(', ')} }`;
  }

  private transpilePrimitiveDefaultValue(typeStr: string): string {
    switch (typeStr.toUpperCase()) {
      case 'ENTERO':
      case 'ENETRO':
      case 'DECIMAL':
      case 'REAL':
        return '0';
      case 'CADENA':
      case 'TEXTO':
        return '""';
      case 'BOOLEANO':
      case 'LOGICO':
        return 'false';
      case 'ARRAY':
      case 'MATRIZ':
      case 'LISTA':
        return '[]';
      default:
        return this.typeDeclarations.has(typeStr) ? this.transpileDefaultValue(typeStr) : 'undefined';
    }
  }
}
