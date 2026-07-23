import assert from 'node:assert/strict';

import { Interpreter } from './interpreter';
import { Lexer } from './lexer';
import { Parser } from './parser';

const runProgram = async (source: string) => {
  const errors: string[] = [];
  const lexer = new Lexer(source);
  const parser = new Parser(lexer.tokenize());
  const program = parser.parse();

  await new Interpreter({
    onPrint: () => undefined,
    onRead: () => undefined,
    onCanvas: () => undefined,
    onSound: () => undefined,
    onStep: async () => undefined,
    onVariableUpdate: () => undefined,
    onFinished: () => undefined,
    onError: (error) => errors.push(error),
  }).execute(program);

  return errors;
};

const parseProgram = (source: string) => {
  const lexer = new Lexer(source);
  const parser = new Parser(lexer.tokenize());
  return parser.parse();
};

const tests = [
  function rejectsProgramWithoutMainBlock() {
    assert.throws(
      () => parseProgram('DEFINIR hola COMO ENTERO\nhola <- 1'),
      /No se detectó el programa principal/
    );
  },
  function rejectsProgramWithoutClosingFin() {
    assert.throws(
      () => parseProgram('INICIO\nDEFINIR hola COMO ENTERO\nhola <- 1'),
      /Se esperaba 'FIN'/
    );
  },
  async function rejectsUndeclaredAssignment() {
    const errors = await runProgram('INICIO\nhola <- 1\nFIN');
    assert.match(errors[0] ?? '', /Variable 'hola' no declarada/);
  },
  async function acceptsDeclaredAssignment() {
    const errors = await runProgram('INICIO\nDEFINIR hola COMO ENTERO\nhola <- 1\nFIN');
    assert.deepEqual(errors, []);
  },
];

for (const test of tests) {
  await test();
}
