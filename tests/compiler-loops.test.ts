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

{
  const program = parse(`
INICIO
  DEFINIR i COMO ENTERO
  i <- 0

  REPETIR
    i <- i + 1
    IMPRIMIR i
  HASTA QUE i == 3
FIN
`);

  assert.equal(program.body[2].type, 'RepeatUntil');

  const transpiled = new Transpiler().transpile(program);
  assert.match(transpiled, /do \{/);
  assert.match(transpiled, /} while \(!\(\(i == 3\)\)\);/);

  const output = await execute(`
INICIO
DEFINIR i COMO ENTERO
i <- 0
REPETIR
  i <- i + 1
  IMPRIMIR i
HASTA QUE i == 3
FIN
`);
  assert.deepEqual(output, ['1', '2', '3']);
}

{
  const output = await execute(`
INICIO
DEFINIR total COMO ENTERO
total <- 0

PARA i <- 1 HASTA 5 PASO 2 HACER
  total <- total + i
FIN_ PARA

IMPRIMIR total
FIN
`);

  assert.deepEqual(output, ['9']);
}

{
  const output = await execute(`
Inicio
  Definir intento Como Entero
  intento <- 0

  Repetir
    intento <- intento + 1
  HastaQue intento == 2

  Para i <- 1 Hasta 3 Paso 1 Hacer
    intento <- intento + i
  FinPara

  Imprimir intento
Fin
`);

  assert.deepEqual(output, ['8']);
}

console.log('compiler loop tests passed');
