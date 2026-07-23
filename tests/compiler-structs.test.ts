import assert from 'node:assert/strict';
import { Lexer } from '../src/compiler/lexer';
import { Parser } from '../src/compiler/parser';
import { Transpiler } from '../src/compiler/transpiler';
import { Interpreter, type InterpreterCallbacks } from '../src/compiler/interpreter';
import type { ProgramNode } from '../src/compiler/ast';

const parse = (source: string): ProgramNode => new Parser(new Lexer(source).tokenize()).parse();

const execute = async (source: string) => {
  const output: string[] = [];
  const callbacks: InterpreterCallbacks = {
    onPrint: (message) => output.push(message),
    onRead: (_prompt, callback) => callback(''),
    onCanvas: () => undefined,
    onSound: () => undefined,
    onStep: async () => undefined,
    onVariableUpdate: () => undefined,
    onError: (error) => {
      throw new Error(error);
    },
    onFinished: () => undefined,
  };

  await new Interpreter(callbacks).execute(parse(source));
  return output;
};

const source = `
TIPO Estudiante
  nombre COMO TEXTO
  edad COMO ENETRO
  promedio COMO DECIMAL
FIN_TIPO

DEFINIR alumno COMO Estudiante
alumno.nombre <- "Luis"
alumno.edad <- 18
alumno.promedio <- 9.5

PRINT alumno.nombre
IMPRIMIR alumno.edad, alumno.promedio
`;

{
  const program = parse(source);

  assert.equal(program.body[0].type, 'TypeDeclaration');
  assert.equal(program.body[1].type, 'VarDeclaration');
  assert.equal(program.body[2].type, 'Assignment');
  assert.equal(program.body[4].type, 'Assignment');

  const transpiled = new Transpiler().transpile(program);
  assert.match(transpiled, /interface Estudiante \{/);
  assert.match(transpiled, /nombre: string;/);
  assert.match(transpiled, /let alumno: Estudiante = \{/);
  assert.match(transpiled, /alumno\.nombre = "Luis";/);
  assert.match(transpiled, /console\.log\(alumno\.nombre\);/);
}

{
  const output = await execute(source);
  assert.deepEqual(output, ['Luis', '18 9.5']);
}

console.log('compiler struct tests passed');
