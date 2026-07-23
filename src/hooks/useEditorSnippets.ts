import { RefObject, useMemo, useRef } from 'react';

export interface SnippetAction {
  label: string;
  className: string;
  value: string;
}

const SNIPPETS: SnippetAction[] = [
  { label: '+ Definir ... Como', className: 'text-indigo-300', value: 'Definir x Como Entero\n' },
  {
    label: '+ Constante ...',
    className: 'text-sky-300',
    value: 'Constante PI Como Decimal <- 3.14\n',
  },
  {
    label: '+ arreglo[tam]',
    className: 'text-indigo-300',
    value: 'Definir edades[5] Como Entero\n',
  },
  {
    label: '+ matriz[f,c]',
    className: 'text-indigo-300',
    value: 'Definir tabla[2, 3] Como Entero\n',
  },
  { label: '+ x <- valor', className: 'text-emerald-300', value: 'x <- 10\n' },
  {
    label: '+ Tipo ...',
    className: 'text-indigo-300',
    value: 'Tipo Nombre\n  campo Como Texto\nFinTipo\n',
  },
  {
    label: '+ Si ... Entonces',
    className: 'text-purple-300',
    value: 'Si condicion Entonces\n  // codigo\nFinSi\n',
  },
  {
    label: '+ SinoSi ...',
    className: 'text-purple-300',
    value: 'SinoSi condicion Entonces\n  // codigo\n',
  },
  {
    label: '+ Mientras ... Hacer',
    className: 'text-cyan-300',
    value: 'Mientras condicion Hacer\n  // codigo\nFinMientras\n',
  },
  {
    label: '+ Repetir ... Hasta',
    className: 'text-cyan-300',
    value: 'Repetir\n  // codigo\nHastaQue condicion\n',
  },
  {
    label: '+ Para ... Hasta',
    className: 'text-amber-300',
    value: 'Para i <- 1 Hasta 10 Paso 1 Hacer\n  // codigo\nFinPara\n',
  },
  { label: '+ Imprimir(...)', className: 'text-emerald-300', value: 'Imprimir("Mensaje")\n' },
  { label: '+ Leer(...)', className: 'text-pink-300', value: 'Leer("Mensaje:", variable)\n' },
];

export function useEditorSnippets(code: string, setCode: (code: string) => void) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const snippets = useMemo(() => SNIPPETS, []);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const insertSnippet = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setCode(code.substring(0, start) + snippet + code.substring(end));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 0);
  };

  return { textareaRef, lineNumbersRef, snippets, handleScroll, insertSnippet };
}

export type EditorTextAreaRef = RefObject<HTMLTextAreaElement>;
