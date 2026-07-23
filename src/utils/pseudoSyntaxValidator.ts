import { Lexer, LexerError } from '../compiler/lexer';
import { Parser, ParserError } from '../compiler/parser';
import type {
  ASTNode,
  AssignmentNode,
  ExpressionNode,
  Position,
  ProgramNode,
  TypeDeclarationNode,
  VarDeclarationNode,
} from '../compiler/ast';

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

type ValueType = 'Entero' | 'Decimal' | 'Texto' | 'Logico' | 'Lista' | 'Desconocido';

interface DeclaredVariable {
  type: string;
  isCollection: boolean;
}

const diagnosticAt = (pos: Position | undefined, message: string): PseudoSyntaxDiagnostic => ({
  line: pos?.line ?? 1,
  column: pos?.column ?? 1,
  message,
  severity: 'error',
});

const normalizeDeclaredType = (typeName: string): ValueType => {
  switch (typeName.toUpperCase()) {
    case 'ENTERO':
    case 'ENETRO':
      return 'Entero';
    case 'DECIMAL':
    case 'REAL':
      return 'Decimal';
    case 'CADENA':
    case 'TEXTO':
      return 'Texto';
    case 'BOOLEANO':
    case 'LOGICO':
      return 'Logico';
    case 'ARRAY':
    case 'MATRIZ':
    case 'LISTA':
      return 'Lista';
    default:
      return 'Desconocido';
  }
};

const isGenericCollectionType = (typeName: string): boolean => {
  const normalized = typeName.toUpperCase();
  return normalized === 'ARRAY' || normalized === 'MATRIZ' || normalized === 'LISTA';
};

const describeExpectedType = (typeName: string): string => {
  switch (normalizeDeclaredType(typeName)) {
    case 'Entero':
      return 'un número entero';
    case 'Decimal':
      return 'un número';
    case 'Texto':
      return 'texto';
    case 'Logico':
      return 'Verdadero o Falso';
    case 'Lista':
      return 'una lista o matriz';
    default:
      return typeName;
  }
};

const isAssignable = (declaredType: string, valueType: ValueType): boolean => {
  if (valueType === 'Desconocido') return true;

  switch (normalizeDeclaredType(declaredType)) {
    case 'Entero':
      return valueType === 'Entero';
    case 'Decimal':
      return valueType === 'Entero' || valueType === 'Decimal';
    case 'Texto':
      return valueType === 'Texto';
    case 'Logico':
      return valueType === 'Logico';
    case 'Lista':
      return valueType === 'Lista';
    default:
      return true;
  }
};

const inferExpressionType = (
  expression: ExpressionNode,
  variables: Map<string, DeclaredVariable>,
  diagnostics: PseudoSyntaxDiagnostic[]
): ValueType => {
  switch (expression.type) {
    case 'Literal':
      switch (expression.literalType) {
        case 'ENTERO':
          return 'Entero';
        case 'DECIMAL':
          return 'Decimal';
        case 'CADENA':
          return 'Texto';
        case 'LOGICO':
          return 'Logico';
        case 'ARRAY':
          return 'Lista';
        default:
          return 'Desconocido';
      }

    case 'Variable': {
      const variable = variables.get(expression.name);
      if (!variable) {
        diagnostics.push(
          diagnosticAt(expression.pos, `La variable '${expression.name}' no está definida`)
        );
        return 'Desconocido';
      }
      return normalizeDeclaredType(variable.type);
    }

    case 'ArrayAccess': {
      const variable = variables.get(expression.arrayName);
      if (!variable) return 'Desconocido';
      return isGenericCollectionType(variable.type)
        ? 'Desconocido'
        : normalizeDeclaredType(variable.type);
    }

    case 'Binary':
      if (['==', '!=', '<', '>', '<=', '>=', 'Y', 'O'].includes(expression.operator)) {
        return 'Logico';
      }
      return 'Desconocido';

    case 'Unary':
      return expression.operator === 'NO' ? 'Logico' : 'Desconocido';

    case 'FunctionCall':
    case 'PropertyAccess':
      return 'Desconocido';
  }
};

const validateValueForType = (
  targetName: string,
  declaredType: string,
  expression: ExpressionNode,
  variables: Map<string, DeclaredVariable>,
  diagnostics: PseudoSyntaxDiagnostic[]
): void => {
  const valueType = inferExpressionType(expression, variables, diagnostics);
  if (!isAssignable(declaredType, valueType)) {
    diagnostics.push(
      diagnosticAt(
        expression.pos,
        `La variable '${targetName}' es ${normalizeDeclaredType(declaredType)} y solo acepta ${describeExpectedType(declaredType)}`
      )
    );
  }
};

const validateDeclaration = (
  node: VarDeclarationNode,
  variables: Map<string, DeclaredVariable>,
  diagnostics: PseudoSyntaxDiagnostic[]
): void => {
  variables.set(node.identifier, {
    type: node.varType,
    isCollection: Boolean(node.dimensions) || isGenericCollectionType(node.varType),
  });

  if (node.value) {
    validateValueForType(node.identifier, node.varType, node.value, variables, diagnostics);
  }
};

const validateAssignment = (
  node: AssignmentNode,
  variables: Map<string, DeclaredVariable>,
  typeDeclarations: Map<string, TypeDeclarationNode>,
  diagnostics: PseudoSyntaxDiagnostic[]
): void => {
  const variable = variables.get(node.identifier);
  if (!variable) return;

  if (node.propertyName) {
    const field = typeDeclarations
      .get(variable.type)
      ?.fields.find((declaredField) => declaredField.name === node.propertyName);
    if (field) {
      validateValueForType(
        `${node.identifier}.${node.propertyName}`,
        field.fieldType,
        node.value,
        variables,
        diagnostics
      );
    }
    return;
  }

  if (node.indexExpr) {
    if (!isGenericCollectionType(variable.type)) {
      validateValueForType(node.identifier, variable.type, node.value, variables, diagnostics);
    }
    return;
  }

  validateValueForType(node.identifier, variable.type, node.value, variables, diagnostics);
};

const validateStatement = (
  node: ASTNode,
  variables: Map<string, DeclaredVariable>,
  typeDeclarations: Map<string, TypeDeclarationNode>,
  diagnostics: PseudoSyntaxDiagnostic[]
): void => {
  switch (node.type) {
    case 'TypeDeclaration':
      typeDeclarations.set(node.name, node);
      break;

    case 'VarDeclaration':
      validateDeclaration(node, variables, diagnostics);
      break;

    case 'Assignment':
      validateAssignment(node, variables, typeDeclarations, diagnostics);
      break;

    case 'If':
      node.thenBranch.forEach((statement) =>
        validateStatement(statement, variables, typeDeclarations, diagnostics)
      );
      node.elseBranch?.forEach((statement) =>
        validateStatement(statement, variables, typeDeclarations, diagnostics)
      );
      break;

    case 'While':
    case 'RepeatUntil':
      node.body.forEach((statement) =>
        validateStatement(statement, variables, typeDeclarations, diagnostics)
      );
      break;

    case 'For':
      variables.set(node.identifier, { type: 'ENTERO', isCollection: false });
      node.body.forEach((statement) =>
        validateStatement(statement, variables, typeDeclarations, diagnostics)
      );
      break;
  }
};

const validateSemanticTypes = (program: ProgramNode): PseudoSyntaxDiagnostic[] => {
  const variables = new Map<string, DeclaredVariable>();
  const typeDeclarations = new Map<string, TypeDeclarationNode>();
  const diagnostics: PseudoSyntaxDiagnostic[] = [];

  program.body.forEach((statement) =>
    validateStatement(statement, variables, typeDeclarations, diagnostics)
  );

  return diagnostics;
};

export const validatePseudoSyntax = (code: string): PseudoSyntaxDiagnostic[] => {
  if (!code.trim()) return [];

  try {
    const tokens = new Lexer(code).tokenize();
    const program = new Parser(tokens).parse();
    return validateSemanticTypes(program);
  } catch (error) {
    if (error instanceof LexerError || error instanceof ParserError) {
      return [toDiagnostic(error)];
    }
    throw error;
  }
};
