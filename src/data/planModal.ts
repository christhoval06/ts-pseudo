export const planKeywords = [
  'Inicio',
  'Fin',
  'Imprimir',
  'Leer',
  'Constante',
  'Tipo ... FinTipo',
  'Si ... Entonces',
  'Mientras',
  'Repetir ... HastaQue',
  'Para',
  'Proceso ... FinProceso',
  'Entero',
  'Decimal',
  'Texto',
  'Logico',
  'Matriz',
];

export const syntaxGroups = [
  ['Programa Base', 'Inicio ... Fin, comentarios //, # y /* ... */'],
  ['Variables y Constantes', 'Definir nombre Como Entero, Constante PI Como Decimal <- 3.14'],
  ['Tipos de Datos', 'Entero, Decimal/REAL, Texto/CADENA, Logico/Booleano, Matriz/Lista/Array'],
  ['Asignacion y Operadores', '<- o =, +, -, *, /, %, ^, ==, !=, <, >, <=, >=, Y, O, NO'],
  ['Condicionales', 'Si condicion Entonces ... SinoSi ... Sino ... FinSi'],
  ['Bucles', 'Mientras ... Hacer, Repetir ... HastaQue, Para i <- 1 Hasta 10 Paso 1 Hacer'],
  [
    'Arreglos y Matrices',
    'Definir nombre[tamano] Como Entero, Definir nombre[filas, columnas] Como Decimal',
  ],
  ['Registros / Tipo', 'Tipo Persona ... FinTipo, Definir p Como Persona, p.nombre <- valor'],
  ['Procesos', 'Proceso saludar(nombre Como Texto) ... FinProceso, saludar("Ana")'],
  ['Entrada / Salida', 'Imprimir(...), Mostrar(...), Leer("pregunta", variable), Ingresar(...)'],
  [
    'Canvas y Sonido',
    'LimpiarCanvas(), ColorPincel(color), DibujarCirculo(...), DibujarRectangulo(...), DibujarLinea(...), TocarNota(frecuencia, ms), Pausar(ms)',
  ],
  [
    'Funciones Integradas',
    'ALEATORIO(min, max), LONGITUD(lista), RAIZ(n), ABS(n), MAYUSCULAS(texto), MINUSCULAS(texto)',
  ],
];

export const compilerPipeline = [
  ['1', 'Lexer / Tokenizer', 'Transforma el codigo fuente en tokens con linea y columna.'],
  ['2', 'Parser', 'Construye el AST con descenso recursivo y valida estructuras.'],
  ['3', 'Interpreter', 'Evalua el AST paso a paso, variables, entrada, Canvas y audio.'],
  ['4', 'Transpilador', 'Traduce pseudocodigo en espanol a TypeScript / JavaScript.'],
];

export const teachingFeatures = [
  'Depuracion visual paso a paso con resaltado de linea.',
  'Inspeccion de memoria en tiempo real.',
  'Comandos para pintar en Canvas 2D y reproducir sonidos.',
  'Mensajes de error amigables para estudiantes.',
];
