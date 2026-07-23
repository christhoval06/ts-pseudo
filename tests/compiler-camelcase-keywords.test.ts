import assert from 'node:assert/strict';

import { Lexer } from '../src/compiler/lexer';
import { Parser } from '../src/compiler/parser';
import type { CanvasNode, ProgramNode } from '../src/compiler/ast';

const parse = (source: string): ProgramNode => new Parser(new Lexer(source).tokenize()).parse();

{
  const program = parse(`
Inicio
  DibujarCirculo(10, 20, 30)
  DibujarRectangulo(10, 20, 30, 40)
  DibujarLinea(0, 0, 100, 100)
  LimpiarCanvas()
  ColorPincel("#ff0000")
Fin
`);

  const commands = program.body as CanvasNode[];

  assert.deepEqual(
    commands.map((node) => node.command),
    ['DIBUJAR_CIRCULO', 'DIBUJAR_RECTANGULO', 'DIBUJAR_LINEA', 'LIMPIAR_CANVAS', 'COLOR_PINCEL']
  );
}

console.log('compiler camelcase keyword tests passed');
