import assert from 'node:assert/strict';

import { getRuntimeErrorPresentation } from '../src/utils/runtimeErrors';

const presentation = getRuntimeErrorPresentation(
  "Error de Ejecución [Línea 3, Columna 11]: La variable 'edad' es Entero y solo acepta un número entero"
);

assert.equal(presentation.status, 'error');
assert.equal(presentation.activeTab, 'console');
assert.equal(presentation.errorLine, 3);
assert.equal(
  presentation.log,
  "Error: Error de Ejecución [Línea 3, Columna 11]: La variable 'edad' es Entero y solo acepta un número entero"
);

console.log('runtime error ui tests passed');
