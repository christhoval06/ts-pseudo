import assert from 'node:assert/strict';

import {
  createPcodeDownloadName,
  isPcodeFileName,
  parsePcodeFile,
  serializePcodeFile,
} from '../src/utils/pcodeFiles.ts';

{
  const code = `INICIO
  IMPRIMIR "Hola"
FIN`;

  assert.equal(serializePcodeFile(code), code);
  assert.equal(parsePcodeFile(code), code);
}

{
  assert.equal(createPcodeDownloadName('mi programa'), 'mi-programa.pcode');
  assert.equal(createPcodeDownloadName('demo.pcode'), 'demo.pcode');
  assert.equal(createPcodeDownloadName('   '), 'programa.pcode');
}

{
  assert.equal(isPcodeFileName('actividad.pcode'), true);
  assert.equal(isPcodeFileName('ACTIVIDAD.PCODE'), true);
  assert.equal(isPcodeFileName('actividad.txt'), false);
}

console.log('pcode file tests passed');
