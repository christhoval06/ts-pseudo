import assert from 'node:assert/strict';

import { validatePseudoSyntax } from '../src/utils/pseudoSyntaxValidator';

assert.deepEqual(
  validatePseudoSyntax(`INICIO
  IMPRIMIR("hola")
FIN`),
  []
);

const missingFinDiagnostics = validatePseudoSyntax(`INICIO
  IMPRIMIR("hola")`);

assert.equal(missingFinDiagnostics.length, 1);
assert.equal(missingFinDiagnostics[0].severity, 'error');
assert.match(missingFinDiagnostics[0].message, /FIN/);
assert.equal(missingFinDiagnostics[0].line, 2);

const lexerDiagnostics = validatePseudoSyntax(`INICIO
  IMPRIMIR(@)
FIN`);

assert.equal(lexerDiagnostics.length, 1);
assert.equal(lexerDiagnostics[0].line, 2);
assert.equal(lexerDiagnostics[0].column, 12);
assert.match(lexerDiagnostics[0].message, /Carácter no reconocido/);

assert.deepEqual(
  validatePseudoSyntax(`Inicio
  Definir i Como Entero
  i <- 0
  Repetir
    i <- i + 1
  HastaQue i == 2
Fin`),
  []
);

const invalidEnteroTextDiagnostics = validatePseudoSyntax(`Inicio
  Definir edad Como Entero
  edad <- "edds"
Fin`);

assert.equal(invalidEnteroTextDiagnostics.length, 1);
assert.equal(invalidEnteroTextDiagnostics[0].line, 3);
assert.match(invalidEnteroTextDiagnostics[0].message, /edad.*Entero.*número entero/i);

const invalidEnteroDecimalDiagnostics = validatePseudoSyntax(`Inicio
  Definir edad Como Entero
  edad <- 12.5
Fin`);

assert.equal(invalidEnteroDecimalDiagnostics.length, 1);
assert.match(invalidEnteroDecimalDiagnostics[0].message, /edad.*Entero.*número entero/i);

const unknownValueDiagnostics = validatePseudoSyntax(`Inicio
  Definir edad Como Entero
  edad <- edds
Fin`);

assert.equal(unknownValueDiagnostics.length, 1);
assert.match(unknownValueDiagnostics[0].message, /edds.*no está definida/i);
