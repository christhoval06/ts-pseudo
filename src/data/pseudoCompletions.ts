import { Completion } from '@codemirror/autocomplete';

const snippet = (label: string, apply: string, detail: string): Completion => ({
  label,
  apply,
  detail,
  type: 'keyword',
});

export const keywordCompletions: Completion[] = [
  snippet('Inicio', 'Inicio\n  \nFin', 'estructura principal'),
  snippet('Definir', 'Definir nombre Como Entero', 'declarar variable'),
  snippet('Constante', 'Constante PI Como Decimal <- 3.14', 'declarar valor fijo'),
  snippet('ARREGLO', 'Definir edades[5] Como Entero', 'arreglo con tamaño fijo'),
  snippet('Matriz', 'Definir tabla[2, 3] Como Entero', 'matriz con filas y columnas'),
  snippet('Tipo', 'Tipo Nombre\n  campo Como Texto\nFinTipo', 'registro personalizado'),
  snippet('Si', 'Si condicion Entonces\n  \nFinSi', 'condicional'),
  snippet('SinoSi', 'SinoSi condicion Entonces\n  ', 'rama condicional alternativa'),
  snippet('Sino', 'Sino\n  ', 'rama alternativa'),
  snippet('Mientras', 'Mientras condicion Hacer\n  \nFinMientras', 'bucle condicional'),
  snippet('Repetir', 'Repetir\n  \nHastaQue condicion', 'bucle hasta condicion'),
  snippet('Para', 'Para i <- 1 Hasta 10 Paso 1 Hacer\n  \nFinPara', 'bucle contador'),
  snippet('Imprimir', 'Imprimir("Mensaje")', 'mostrar texto'),
  snippet('Leer', 'Leer("Mensaje:", variable)', 'pedir entrada'),
  snippet('Entero', 'Entero', 'tipo numerico'),
  snippet('Decimal', 'Decimal', 'tipo numerico'),
  snippet('Texto', 'Texto', 'tipo texto'),
  snippet('Booleano', 'Booleano', 'tipo logico'),
  snippet('Lista', 'Lista', 'tipo lista'),
];

export const commandCompletions: Completion[] = [
  snippet('LimpiarCanvas', 'LimpiarCanvas()', 'canvas: limpiar'),
  snippet('ColorPincel', 'ColorPincel("#6366f1")', 'canvas: color'),
  snippet('DibujarCirculo', 'DibujarCirculo(200, 150, 50)', 'x, y, radio'),
  snippet('DibujarRectangulo', 'DibujarRectangulo(10, 10, 100, 100)', 'x, y, ancho, alto'),
  snippet('DibujarLinea', 'DibujarLinea(0, 0, 100, 100)', 'x1, y1, x2, y2'),
  snippet('TocarNota', 'TocarNota(440, 400)', 'frecuencia, duracion'),
  snippet('ALEATORIO', 'ALEATORIO(1, 10)', 'min, max'),
  snippet('LONGITUD', 'LONGITUD(lista)', 'cadena o matriz'),
  snippet('RAIZ', 'RAIZ(numero)', 'raiz cuadrada'),
  snippet('ABS', 'ABS(numero)', 'valor absoluto'),
];

export const pseudoCompletions = [...keywordCompletions, ...commandCompletions];
