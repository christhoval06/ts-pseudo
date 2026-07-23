export type ASTNode =
  | ProgramNode
  | VarDeclarationNode
  | TypeDeclarationNode
  | ProcedureNode
  | AssignmentNode
  | ExpressionStatementNode
  | PrintNode
  | ReadNode
  | IfNode
  | WhileNode
  | RepeatUntilNode
  | ForNode
  | PauseNode
  | CanvasNode
  | SoundNode
  | ExpressionNode;

export interface Position {
  line: number;
  column: number;
}

export interface ProgramNode {
  type: 'Program';
  body: ASTNode[];
  pos?: Position;
}

export interface VarDeclarationNode {
  type: 'VarDeclaration';
  varType: string; // ENTERO, DECIMAL, TEXTO, LOGICO, MATRIZ
  identifier: string;
  dimensions?: ExpressionNode[];
  value?: ExpressionNode;
  isConstant?: boolean;
  pos?: Position;
}

export interface TypeFieldNode {
  name: string;
  fieldType: string;
  pos?: Position;
}

export interface TypeDeclarationNode {
  type: 'TypeDeclaration';
  name: string;
  fields: TypeFieldNode[];
  pos?: Position;
}

export interface ProcedureParamNode {
  name: string;
  paramType: string;
  pos?: Position;
}

export interface ProcedureNode {
  type: 'Procedure';
  name: string;
  params: ProcedureParamNode[];
  body: ASTNode[];
  pos?: Position;
}

export interface AssignmentNode {
  type: 'Assignment';
  identifier: string;
  propertyName?: string;
  indexExpr?: ExpressionNode; // for matrix/array assignment
  indexExprs?: ExpressionNode[];
  value: ExpressionNode;
  pos?: Position;
}

export interface ExpressionStatementNode {
  type: 'ExpressionStatement';
  expression: ExpressionNode;
  pos?: Position;
}

export interface PrintNode {
  type: 'Print';
  expressions: ExpressionNode[];
  pos?: Position;
}

export interface ReadNode {
  type: 'Read';
  identifier: string;
  prompt?: string;
  pos?: Position;
}

export interface IfNode {
  type: 'If';
  condition: ExpressionNode;
  thenBranch: ASTNode[];
  elseBranch?: ASTNode[];
  pos?: Position;
}

export interface WhileNode {
  type: 'While';
  condition: ExpressionNode;
  body: ASTNode[];
  pos?: Position;
}

export interface RepeatUntilNode {
  type: 'RepeatUntil';
  condition: ExpressionNode;
  body: ASTNode[];
  pos?: Position;
}

export interface ForNode {
  type: 'For';
  identifier: string;
  startExpr: ExpressionNode;
  endExpr: ExpressionNode;
  stepExpr?: ExpressionNode;
  body: ASTNode[];
  pos?: Position;
}

export interface PauseNode {
  type: 'Pause';
  msExpr: ExpressionNode;
  pos?: Position;
}

export interface CanvasNode {
  type: 'CanvasCommand';
  command:
    'DIBUJAR_CIRCULO' | 'DIBUJAR_RECTANGULO' | 'DIBUJAR_LINEA' | 'LIMPIAR_CANVAS' | 'COLOR_PINCEL';
  args: ExpressionNode[];
  pos?: Position;
}

export interface SoundNode {
  type: 'SoundCommand';
  noteExpr: ExpressionNode;
  durationExpr?: ExpressionNode;
  pos?: Position;
}

// Expressions
export type ExpressionNode =
  | LiteralNode
  | VariableNode
  | PropertyAccessNode
  | ArrayAccessNode
  | BinaryNode
  | UnaryNode
  | FunctionCallNode;

export interface LiteralNode {
  type: 'Literal';
  value: number | string | boolean | unknown[];
  literalType: 'ENTERO' | 'DECIMAL' | 'CADENA' | 'LOGICO' | 'ARRAY';
  pos?: Position;
}

export interface VariableNode {
  type: 'Variable';
  name: string;
  pos?: Position;
}

export interface PropertyAccessNode {
  type: 'PropertyAccess';
  objectName: string;
  propertyName: string;
  pos?: Position;
}

export interface ArrayAccessNode {
  type: 'ArrayAccess';
  arrayName: string;
  indexExpr: ExpressionNode;
  indexExprs?: ExpressionNode[];
  pos?: Position;
}

export interface BinaryNode {
  type: 'Binary';
  operator: string; // +, -, *, /, %, ^, ==, !=, <, >, <=, >=, Y, O
  left: ExpressionNode;
  right: ExpressionNode;
  pos?: Position;
}

export interface UnaryNode {
  type: 'Unary';
  operator: string; // -, NO
  operand: ExpressionNode;
  pos?: Position;
}

export interface FunctionCallNode {
  type: 'FunctionCall';
  name: string; // e.g. ALEATORIO, LONGITUD, CONCATENAR, ABS, RAIZ
  args: ExpressionNode[];
  pos?: Position;
}
