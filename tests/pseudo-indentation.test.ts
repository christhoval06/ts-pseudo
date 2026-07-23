import assert from 'node:assert/strict';

import {
  getIndentForNewLine,
  getIndentForTypedLine,
  PSEUDO_INDENT,
} from '../src/utils/pseudoIndentation';

assert.equal(getIndentForNewLine('INICIO'), PSEUDO_INDENT);
assert.equal(getIndentForNewLine('  SI edad >= 18 ENTONCES'), '    ');
assert.equal(getIndentForNewLine('  IMPRIMIR("hola")'), '  ');
assert.equal(getIndentForNewLine('PROCESO saludar(nombre COMO TEXTO)'), PSEUDO_INDENT);
assert.equal(getIndentForNewLine('TIPO Persona'), PSEUDO_INDENT);
assert.equal(getIndentForNewLine('REPETIR'), PSEUDO_INDENT);

assert.equal(getIndentForTypedLine('INICIO\n  IMPRIMIR("hola")', 'FIN'), '');
assert.equal(
  getIndentForTypedLine('INICIO\n  SI edad >= 18 ENTONCES\n    IMPRIMIR("ok")', 'FIN_SI'),
  '  '
);
assert.equal(
  getIndentForTypedLine('INICIO\n  REPETIR\n    IMPRIMIR("x")', 'HASTA QUE listo'),
  '  '
);
assert.equal(
  getIndentForTypedLine('Inicio\n  Repetir\n    Imprimir("x")', 'HastaQue listo'),
  '  '
);
assert.equal(
  getIndentForTypedLine('PROCESO saludar(nombre COMO TEXTO)\n  IMPRIMIR(nombre)', 'FIN_PROCESO'),
  ''
);
