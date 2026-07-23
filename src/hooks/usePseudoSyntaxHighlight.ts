import { RangeSetBuilder } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view';

import { SPANISH_KEYWORDS, TokenType } from '../compiler/tokens';

type TokenRule = { regex: RegExp; className: string };
type TokenMark = { from: number; to: number; decoration: Decoration };

const keywordPattern = (keywords: string[]): RegExp =>
  new RegExp(`\\b(${keywords.sort((a, b) => b.length - a.length).join('|')})\\b`, 'gi');

const keywordsForTypes = (types: TokenType[]): string[] => {
  const typeSet = new Set(types);
  return Object.entries(SPANISH_KEYWORDS)
    .filter(([, tokenType]) => typeSet.has(tokenType))
    .map(([keyword]) => keyword);
};

export const pseudoHighlightedKeywords = Object.keys(SPANISH_KEYWORDS);

const controlKeywords = keywordsForTypes([
  TokenType.INICIO,
  TokenType.FIN,
  TokenType.SI,
  TokenType.ENTONCES,
  TokenType.SINO,
  TokenType.SINO_SI,
  TokenType.FIN_SI,
  TokenType.MIENTRAS,
  TokenType.HACER,
  TokenType.FIN_MIENTRAS,
  TokenType.REPETIR,
  TokenType.HASTA,
  TokenType.QUE,
  TokenType.PARA,
  TokenType.PASO,
  TokenType.FIN_PARA,
  TokenType.PAUSAR,
]);
const declarationKeywords = keywordsForTypes([
  TokenType.DEFINIR,
  TokenType.CONSTANTE,
  TokenType.VAR,
  TokenType.COMO,
  TokenType.TIPO,
  TokenType.FIN_TIPO,
  TokenType.PROCESO,
  TokenType.FIN_PROCESO,
]);
const typeKeywords = keywordsForTypes([
  TokenType.T_ENTERO,
  TokenType.T_DECIMAL,
  TokenType.T_CADENA,
  TokenType.T_LOGICO,
  TokenType.T_ARRAY,
  TokenType.BOOLEANO,
]);
const ioKeywords = keywordsForTypes([TokenType.IMPRIMIR, TokenType.LEER]);
const commandKeywords = keywordsForTypes([
  TokenType.LIMPIAR_CANVAS,
  TokenType.COLOR_PINCEL,
  TokenType.DIBUJAR_CIRCULO,
  TokenType.DIBUJAR_RECTANGULO,
  TokenType.DIBUJAR_LINEA,
  TokenType.TOCAR_NOTA,
]);
const logicalOperatorKeywords = keywordsForTypes([
  TokenType.Y,
  TokenType.O,
  TokenType.NO,
  TokenType.IGUAL,
  TokenType.DIFERENTE,
]);
const builtInFunctionKeywords = [
  'ALEATORIO',
  'LONGITUD',
  'RAIZ',
  'ABS',
  'MAYUSCULAS',
  'MINUSCULAS',
];

const rules: TokenRule[] = [
  { regex: /\/\/.*/g, className: 'cm-pseudo-comment' },
  { regex: /"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, className: 'cm-pseudo-string' },
  { regex: /\b\d+(?:\.\d+)?\b/g, className: 'cm-pseudo-number' },
  { regex: keywordPattern(controlKeywords), className: 'cm-pseudo-control' },
  { regex: keywordPattern(declarationKeywords), className: 'cm-pseudo-declare' },
  { regex: keywordPattern(typeKeywords), className: 'cm-pseudo-type' },
  { regex: keywordPattern(ioKeywords), className: 'cm-pseudo-io' },
  { regex: keywordPattern(commandKeywords), className: 'cm-pseudo-command' },
  { regex: keywordPattern(builtInFunctionKeywords), className: 'cm-pseudo-command' },
  { regex: keywordPattern(logicalOperatorKeywords), className: 'cm-pseudo-operator' },
  { regex: /(<-|==|!=|<=|>=|[+\-*/=<>(),])/g, className: 'cm-pseudo-operator' },
];

const syntaxTheme = EditorView.baseTheme({
  '.cm-pseudo-comment': { color: '#64748b', fontStyle: 'italic' },
  '.cm-pseudo-string': { color: '#f0abfc' },
  '.cm-pseudo-number': { color: '#fbbf24' },
  '.cm-pseudo-control': { color: '#a78bfa', fontWeight: '700' },
  '.cm-pseudo-declare': { color: '#38bdf8', fontWeight: '700' },
  '.cm-pseudo-type': { color: '#22d3ee', fontWeight: '700' },
  '.cm-pseudo-io': { color: '#34d399', fontWeight: '700' },
  '.cm-pseudo-command': { color: '#fb7185', fontWeight: '700' },
  '.cm-pseudo-operator': { color: '#94a3b8' },
});

const buildDecorations = (view: EditorView): DecorationSet => {
  const builder = new RangeSetBuilder<Decoration>();
  for (const { from, to } of view.visibleRanges) {
    let line = view.state.doc.lineAt(from);
    while (line.from <= to) {
      for (const mark of getLineMarks(line.text, line.from)) {
        builder.add(mark.from, mark.to, mark.decoration);
      }
      if (line.to >= to || line.number === view.state.doc.lines) break;
      line = view.state.doc.line(line.number + 1);
    }
  }
  return builder.finish();
};

const getLineMarks = (text: string, offset: number): TokenMark[] => {
  const marks = rules.flatMap((rule) => getRuleMarks(text, offset, rule));
  const sorted = marks.sort((a, b) => a.from - b.from || b.to - a.to);
  const filtered: TokenMark[] = [];
  let coveredUntil = -1;
  for (const mark of sorted) {
    if (mark.from < coveredUntil) continue;
    filtered.push(mark);
    coveredUntil = mark.to;
  }
  return filtered;
};

const getRuleMarks = (text: string, offset: number, rule: TokenRule): TokenMark[] =>
  Array.from(text.matchAll(rule.regex), (match) => ({
    from: offset + (match.index ?? 0),
    to: offset + (match.index ?? 0) + match[0].length,
    decoration: Decoration.mark({ class: rule.className }),
  }));

const syntaxPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  { decorations: (plugin) => plugin.decorations }
);

export const pseudoSyntaxHighlight = [syntaxTheme, syntaxPlugin];
