import assert from 'node:assert/strict';
import { Lexer } from '../src/compiler/lexer';
import { Parser } from '../src/compiler/parser';
import { Transpiler } from '../src/compiler/transpiler';
import type { IfNode } from '../src/compiler/ast';

const parse = (source: string) => new Parser(new Lexer(source).tokenize()).parse();

{
  const program = parse(`
INICIO
  SI edad < 13 ENTONCES
    IMPRIMIR "nino"
  SINO_SI edad < 18 ENTONCES
    IMPRIMIR "adolescente"
  SINO
    IMPRIMIR "adulto"
  FIN_SI
FIN
`);

  assert.equal(program.body.length, 1);
  const rootIf = program.body[0] as IfNode;
  assert.equal(rootIf.type, 'If');
  assert.equal(rootIf.thenBranch.length, 1);
  assert.equal(rootIf.elseBranch?.length, 1);

  const elseIf = rootIf.elseBranch?.[0] as IfNode;
  assert.equal(elseIf.type, 'If');
  assert.equal(elseIf.thenBranch.length, 1);
  assert.equal(elseIf.elseBranch?.length, 1);

  const transpiled = new Transpiler().transpile(program);
  assert.match(transpiled, /if \(\(edad < 13\)\)/);
  assert.match(transpiled, /} else if \(\(edad < 18\)\) \{/);
  assert.match(transpiled, /} else \{/);
}

{
  const program = parse(`
INICIO
SI a ENTONCES
  SI b ENTONCES
    IMPRIMIR "ambos"
  SINO_SI c ENTONCES
    IMPRIMIR "a y c"
  SINO
    IMPRIMIR "solo a"
  FIN_SI
SINO
  IMPRIMIR "ninguno"
FIN_SI
FIN
`);

  const rootIf = program.body[0] as IfNode;
  const nestedIf = rootIf.thenBranch[0] as IfNode;
  assert.equal(nestedIf.type, 'If');
  assert.equal(nestedIf.elseBranch?.[0].type, 'If');
  assert.equal(rootIf.elseBranch?.[0].type, 'Print');
}

console.log('compiler conditional tests passed');
