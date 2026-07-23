import assert from 'node:assert/strict';
import { Lexer } from '../src/compiler/lexer.ts';
import { Parser } from '../src/compiler/parser.ts';
import { Transpiler } from '../src/compiler/transpiler.ts';
import { Interpreter, type InterpreterCallbacks } from '../src/compiler/interpreter.ts';
import type { ProgramNode } from '../src/compiler/ast.ts';

const parse = (source: string): ProgramNode => new Parser(new Lexer(source).tokenize()).parse();

const execute = async (source: string) => {
  const output: string[] = [];
  let runtimeError = '';
  const callbacks: InterpreterCallbacks = {
    onPrint: (message) => output.push(message),
    onRead: (_prompt, callback) => callback(''),
    onCanvas: () => undefined,
    onSound: () => undefined,
    onStep: async () => undefined,
    onVariableUpdate: () => undefined,
    onError: (error) => {
      runtimeError = error;
    },
    onFinished: () => undefined,
  };

  await new Interpreter(callbacks).execute(parse(source));
  return { output, runtimeError };
};

{
  const source = `
CONSTANTE PI COMO DECIMAL <- 3.14
CONSTANTE saludo COMO TEXTO <- "Hola"

INICIO
  IMPRIMIR(saludo, PI)
FIN
`;

  const program = parse(source);
  assert.equal(program.body[0].type, 'VarDeclaration');
  assert.equal(program.body[1].type, 'VarDeclaration');

  const transpiled = new Transpiler().transpile(program);
  assert.match(transpiled, /const PI: number = 3\.14;/);
  assert.match(transpiled, /const saludo: string = "Hola";/);

  const result = await execute(source);
  assert.deepEqual(result.output, ['Hola 3.14']);
  assert.equal(result.runtimeError, '');
}

{
  const result = await execute(`
CONSTANTE limite COMO ENTERO <- 10
INICIO
  limite <- 11
FIN
`);

  assert.match(result.runtimeError, /constante 'limite'/i);
}

console.log('compiler constant tests passed');
