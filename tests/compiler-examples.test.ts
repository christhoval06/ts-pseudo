import assert from 'node:assert/strict';

import { EXAMPLES } from '../src/compiler/examples';
import { Lexer } from '../src/compiler/lexer';
import { Parser } from '../src/compiler/parser';

const parseExample = (code: string) => new Parser(new Lexer(code).tokenize()).parse();

const treasureExample = EXAMPLES.find((example) => example.id === 'matriz-tesoro-trampas');

assert.ok(treasureExample, 'Expected a matrix treasure example');
assert.match(treasureExample.description, /FILAS.*COLUMNAS.*VIDAS_INICIALES/);
assert.doesNotThrow(() => parseExample(treasureExample.code));

for (const example of EXAMPLES) {
  assert.doesNotThrow(() => parseExample(example.code), `${example.title} should parse`);
}

console.log('compiler example tests passed');
