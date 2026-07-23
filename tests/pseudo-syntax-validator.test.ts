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
