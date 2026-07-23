import { autocompletion, completionKeymap, CompletionContext } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { bracketMatching, foldGutter, indentOnInput } from '@codemirror/language';
import { Diagnostic, linter, lintGutter } from '@codemirror/lint';
import { searchKeymap } from '@codemirror/search';
import { Compartment, EditorState, Extension } from '@codemirror/state';
import {
  Decoration,
  drawSelection,
  dropCursor,
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from '@codemirror/view';
import { RefObject, useEffect, useMemo, useRef } from 'react';

import { pseudoCompletions } from '../data/pseudoCompletions';
import {
  getIndentForNewLine,
  getIndentForTypedLine,
  isPseudoClosingLine,
} from '../utils/pseudoIndentation';
import { validatePseudoSyntax } from '../utils/pseudoSyntaxValidator';
import { pseudoSyntaxHighlight } from './usePseudoSyntaxHighlight';

const lineTheme = EditorView.baseTheme({
  '.cm-line.cm-runtime-line': { backgroundColor: 'rgba(99,102,241,.16)' },
  '.cm-line.cm-error-line': { backgroundColor: 'rgba(244,63,94,.20)' },
});

const editorTheme = EditorView.theme({
  '&': { height: '100%', backgroundColor: '#020617', color: '#e2e8f0' },
  '.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  '.cm-content': { padding: '12px 0', caretColor: '#a5b4fc' },
  '.cm-gutters': { backgroundColor: 'rgba(15,23,42,.6)', borderRightColor: '#1e293b' },
  '.cm-activeLineGutter': { backgroundColor: 'rgba(99,102,241,.16)' },
  '.cm-tooltip': { backgroundColor: '#0f172a', border: '1px solid #334155' },
  '.cm-tooltip-autocomplete ul li[aria-selected]': { backgroundColor: '#4f46e5' },
  '.cm-diagnostic': { backgroundColor: '#0f172a', borderColor: '#7f1d1d', color: '#fecaca' },
  '.cm-lintRange-error': { backgroundImage: 'none', borderBottom: '1px wavy #fb7185' },
});

const completions = (context: CompletionContext) => {
  const word = context.matchBefore(/[A-Z_]*(?:\([A-Z_, ]*)?/i);
  if (!word || (word.from === word.to && !context.explicit)) return null;
  return { from: word.from, options: pseudoCompletions };
};

const lineHighlight = (activeLine?: number, errorLine?: number): Extension =>
  EditorView.decorations.compute([], (state) => {
    const marks = [];
    for (const [line, className] of [
      [activeLine, 'cm-runtime-line'],
      [errorLine, 'cm-error-line'],
    ] as const) {
      if (!line || line > state.doc.lines) continue;
      marks.push(Decoration.line({ class: className }).range(state.doc.line(line).from));
    }
    return Decoration.set(marks, true);
  });

const insertPseudoIndentedNewline = (view: EditorView): boolean => {
  const selection = view.state.selection.main;
  if (!selection.empty) return false;

  const line = view.state.doc.lineAt(selection.head);
  const lineBeforeCursor = line.text.slice(0, selection.head - line.from);
  const indent = getIndentForNewLine(lineBeforeCursor);

  view.dispatch({
    changes: { from: selection.head, insert: `\n${indent}` },
    selection: { anchor: selection.head + 1 + indent.length },
    userEvent: 'input',
  });

  return true;
};

const applyPseudoClosingDedent = (view: EditorView): void => {
  const selection = view.state.selection.main;
  if (!selection.empty) return;

  const line = view.state.doc.lineAt(selection.head);
  if (!isPseudoClosingLine(line.text)) return;

  const currentIndent = line.text.match(/^\s*/)?.[0] ?? '';
  if (!currentIndent) return;

  const documentBeforeLine = view.state.doc.sliceString(0, line.from);
  const targetIndent = getIndentForTypedLine(documentBeforeLine, line.text);
  if (currentIndent === targetIndent) return;

  view.dispatch({
    changes: {
      from: line.from,
      to: line.from + currentIndent.length,
      insert: targetIndent,
    },
    selection: {
      anchor: Math.max(
        line.from + targetIndent.length,
        selection.head - currentIndent.length + targetIndent.length
      ),
    },
  });
};

const pseudoSyntaxLinter = linter(
  (view): Diagnostic[] =>
    validatePseudoSyntax(view.state.doc.toString()).map((diagnostic) => {
      const lineNumber = Math.min(Math.max(diagnostic.line, 1), view.state.doc.lines);
      const line = view.state.doc.line(lineNumber);
      const columnOffset = Math.min(Math.max(diagnostic.column - 1, 0), line.length);
      const from = line.from + columnOffset;
      const to = Math.min(line.to, Math.max(from + 1, from));

      return {
        from,
        to,
        severity: diagnostic.severity,
        message: diagnostic.message,
      };
    }),
  { delay: 350 }
);

export function useCodeMirrorEditor(
  parentRef: RefObject<HTMLDivElement | null>,
  code: string,
  setCode: (code: string) => void,
  activeLine?: number,
  errorLine?: number
) {
  const viewRef = useRef<EditorView | null>(null);
  const lineCompartment = useMemo(() => new Compartment(), []);
  const onChangeRef = useRef(setCode);
  const initialCodeRef = useRef(code);
  onChangeRef.current = setCode;

  useEffect(() => {
    if (!parentRef.current) return;
    const state = EditorState.create({
      doc: initialCodeRef.current,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        lintGutter(),
        drawSelection(),
        dropCursor(),
        indentOnInput(),
        bracketMatching(),
        rectangularSelection(),
        highlightActiveLine(),
        autocompletion({ override: [completions] }),
        keymap.of([
          ...completionKeymap,
          { key: 'Enter', run: insertPseudoIndentedNewline },
          ...defaultKeymap,
          ...historyKeymap,
          ...searchKeymap,
        ]),
        editorTheme,
        lineTheme,
        lineCompartment.of(lineHighlight()),
        pseudoSyntaxHighlight,
        pseudoSyntaxLinter,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return;
          onChangeRef.current(update.state.doc.toString());
          applyPseudoClosingDedent(update.view);
        }),
      ],
    });
    viewRef.current = new EditorView({ state, parent: parentRef.current });
    return () => viewRef.current?.destroy();
  }, [lineCompartment, parentRef]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || view.state.doc.toString() === code) return;
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: code } });
  }, [code]);

  useEffect(() => {
    viewRef.current?.dispatch({
      effects: lineCompartment.reconfigure(lineHighlight(activeLine, errorLine)),
    });
  }, [activeLine, errorLine, lineCompartment]);
}
