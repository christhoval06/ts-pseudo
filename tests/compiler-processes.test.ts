import assert from 'node:assert/strict';
import { Lexer } from '../src/compiler/lexer.ts';
import { Parser } from '../src/compiler/parser.ts';
import { Transpiler } from '../src/compiler/transpiler.ts';
import { Interpreter, type InterpreterCallbacks } from '../src/compiler/interpreter.ts';
import type { ProgramNode, ProcedureNode } from '../src/compiler/ast.ts';

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

{
  const program = parse(`
PROCESO saludar(nombre COMO TEXTO)
  IMPRIMIR("Hola", nombre, "!")
FIN_PROCESO

INICIO
  saludar("Ana")
FIN
`);

  assert.equal(program.body.length, 2);
  const procedure = program.body[0] as ProcedureNode;
  assert.equal(procedure.type, 'Procedure');
  assert.equal(procedure.name, 'saludar');
  assert.deepEqual(
    procedure.params.map((param) => ({ name: param.name, paramType: param.paramType })),
    [{ name: 'nombre', paramType: 'TEXTO' }]
  );

  const transpiled = new Transpiler().transpile(program);
  assert.match(transpiled, /function saludar\(nombre: string\): void \{/);
  assert.match(transpiled, /saludar\("Ana"\);/);

  const output = await execute(`
PROCESO saludar(nombre COMO TEXTO)
  IMPRIMIR("Hola", nombre, "!")
FIN_PROCESO

INICIO
  saludar("Ana")
  saludar("Luis")
FIN
`);

  assert.deepEqual(output, ['Hola Ana !', 'Hola Luis !']);
}

console.log('compiler process tests passed');
