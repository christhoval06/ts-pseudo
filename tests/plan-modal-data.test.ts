import assert from 'node:assert/strict';

import { syntaxGroups } from '../src/data/planModal';

const sectionText = syntaxGroups.flat().join(' ');

assert.match(sectionText, /Proceso .* FinProceso/);
assert.match(sectionText, /Definir nombre\[filas, columnas\]/);
assert.match(sectionText, /MAYUSCULAS\(texto\)/);
