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
INICIO
  DEFINIR edades[5] COMO ENTERO
  edades[0] <- 1
  edades[4] <- 9

  DEFINIR tabla[2, 3] COMO ENTERO
  tabla[0,0] <- 7
  tabla[1,2] <- 8

  IMPRIMIR edades[0], edades[4]
  IMPRIMIR tabla[0,0], tabla[1,2]
FIN
`;

{
  const program = parse(source);
  assert.equal(program.body[0].type, 'VarDeclaration');
  assert.equal(program.body[2].type, 'Assignment');

  const transpiled = new Transpiler().transpile(program);
  assert.match(transpiled, /let edades: number\[\] = Array\.from\(\{ length: 5 \}/);
  assert.match(transpiled, /edades\[0\] = 1;/);
  assert.match(transpiled, /let tabla: number\[\]\[\] = Array\.from\(\{ length: 2 \}/);
  assert.match(transpiled, /tabla\[0\]\[0\] = 7;/);
  assert.match(transpiled, /console\.log\(tabla\[0\]\[0\], tabla\[1\]\[2\]\);/);
}

{
  const output = await execute(source);
  assert.deepEqual(output, ['1 9', '7 8']);
}

console.log('compiler array and matrix tests passed');
