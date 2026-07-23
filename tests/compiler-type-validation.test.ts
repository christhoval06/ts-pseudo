import assert from 'node:assert/strict';

import { Lexer } from '../src/compiler/lexer';
import { Parser } from '../src/compiler/parser';
import { Interpreter, type InterpreterCallbacks } from '../src/compiler/interpreter';

const execute = async (source: string, input = '') => {
  const errors: string[] = [];
  const callbacks: InterpreterCallbacks = {
    onPrint: () => undefined,
    onRead: (_prompt, callback) => callback(input),
    onCanvas: () => undefined,
    onSound: () => undefined,
    onStep: async () => undefined,
    onVariableUpdate: () => undefined,
    onError: (error) => errors.push(error),
    onFinished: () => undefined,
  };

  const program = new Parser(new Lexer(source).tokenize()).parse();
  await new Interpreter(callbacks).execute(program);
  return errors;
};

assert.match(
  (
    await execute(`
Inicio
  Definir edad Como Entero
  edad <- "doce"
Fin
`)
  )[0],
  /'edad'.*Entero.*número entero/i
);

assert.match(
  (
    await execute(`
Inicio
  Definir edad Como Entero
  edad <- 12.5
Fin
`)
  )[0],
  /'edad'.*Entero.*número entero/i
);

assert.match(
  (
    await execute(`
Inicio
  Definir precio Como Decimal
  precio <- "barato"
Fin
`)
  )[0],
  /'precio'.*Decimal.*número/i
);

assert.match(
  (
    await execute(`
Inicio
  Definir nombre Como Texto
  nombre <- 99
Fin
`)
  )[0],
  /'nombre'.*Texto.*texto/i
);

assert.match(
  (
    await execute(`
Inicio
  Definir activo Como Logico
  activo <- "si"
Fin
`)
  )[0],
  /'activo'.*Logico.*Verdadero.*Falso/i
);

assert.match(
  (
    await execute(`
Inicio
  Definir edades[2] Como Entero
  edades[0] <- "once"
Fin
`)
  )[0],
  /'edades'.*Entero.*número entero/i
);

assert.deepEqual(
  await execute(`
Inicio
  Definir heroes Como Matriz
  heroes <- ["Ana", "Luis"]
  heroes[0] <- "Mia"
Fin
`),
  []
);

assert.deepEqual(
  await execute(`
Inicio
  Definir edad Como Entero
  Definir precio Como Decimal
  Definir nombre Como Texto
  Definir activo Como Logico

  edad <- 12
  precio <- 12.5
  nombre <- "Ana"
  activo <- Verdadero
Fin
`),
  []
);

assert.match(
  (
    await execute(
      `
Inicio
  Definir edad Como Entero
  Leer("Edad:", edad)
Fin
`,
      'hola'
    )
  )[0],
  /'edad'.*Entero.*número entero/i
);

assert.match(
  (
    await execute(`
Tipo Estudiante
  edad Como Entero
FinTipo

Inicio
  Definir alumno Como Estudiante
  alumno.edad <- "dieciocho"
Fin
`)
  )[0],
  /'alumno\.edad'.*Entero.*número entero/i
);

console.log('compiler type validation tests passed');
