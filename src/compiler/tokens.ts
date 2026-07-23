export enum TokenType {
  // Structure & Delimiters
  INICIO = 'INICIO',
  FIN = 'FIN',
  DEFINIR = 'DEFINIR',
  CONSTANTE = 'CONSTANTE',
  COMO = 'COMO',
  VAR = 'VAR',
  ASIGNAR = 'ASIGNAR', // '=' or '<-'
  TIPO = 'TIPO',
  FIN_TIPO = 'FIN_TIPO',
  PROCESO = 'PROCESO',
  FIN_PROCESO = 'FIN_PROCESO',

  // Types
  T_ENTERO = 'T_ENTERO',
  T_DECIMAL = 'T_DECIMAL',
  T_CADENA = 'T_CADENA',
  T_LOGICO = 'T_LOGICO',
  T_ARRAY = 'T_ARRAY',

  // I/O & Commands
  IMPRIMIR = 'IMPRIMIR',
  LEER = 'LEER',

  // Control Flow
  SI = 'SI',
  ENTONCES = 'ENTONCES',
  SINO = 'SINO',
  SINO_SI = 'SINO_SI',
  FIN_SI = 'FIN_SI',
  MIENTRAS = 'MIENTRAS',
  HACER = 'HACER',
  FIN_MIENTRAS = 'FIN_MIENTRAS',
  REPETIR = 'REPETIR',
  QUE = 'QUE',
  PARA = 'PARA',
  HASTA = 'HASTA',
  PASO = 'PASO',
  FIN_PARA = 'FIN_PARA',
  PAUSAR = 'PAUSAR',

  // Canvas / Graphics Commands
  DIBUJAR_CIRCULO = 'DIBUJAR_CIRCULO',
  DIBUJAR_RECTANGULO = 'DIBUJAR_RECTANGULO',
  DIBUJAR_LINEA = 'DIBUJAR_LINEA',
  LIMPIAR_CANVAS = 'LIMPIAR_CANVAS',
  COLOR_PINCEL = 'COLOR_PINCEL',
  TOCAR_NOTA = 'TOCAR_NOTA',

  // Literals
  NUMERO = 'NUMERO',
  CADENA = 'CADENA',
  BOOLEANO = 'BOOLEANO', // VERDADERO / FALSO
  IDENTIFICADOR = 'IDENTIFICADOR',

  // Operators
  SUMA = 'SUMA', // +
  RESTA = 'RESTA', // -
  MULTIPLICACION = 'MULTIPLICACION', // *
  DIVISION = 'DIVISION', // /
  MODULO = 'MODULO', // %
  POTENCIA = 'POTENCIA', // ^

  IGUAL = 'IGUAL', // == or ES
  DIFERENTE = 'DIFERENTE', // != or NO_ES
  MENOR = 'MENOR', // <
  MAYOR = 'MAYOR', // >
  MENOR_IGUAL = 'MENOR_IGUAL', // <=
  MAYOR_IGUAL = 'MAYOR_IGUAL', // >=

  Y = 'Y', // Y / AND
  O = 'O', // O / OR
  NO = 'NO', // NO / NOT

  // Symbols
  LPAREN = 'LPAREN', // (
  RPAREN = 'RPAREN', // )
  LBRACKET = 'LBRACKET', // [
  RBRACKET = 'RBRACKET', // ]
  COMMA = 'COMMA', // ,
  COLON = 'COLON', // :
  DOT = 'DOT', // .
  EOF = 'EOF',
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export const SPANISH_KEYWORDS: Record<string, TokenType> = {
  INICIO: TokenType.INICIO,
  FIN: TokenType.FIN,
  DEFINIR: TokenType.DEFINIR,
  CONSTANTE: TokenType.CONSTANTE,
  COMO: TokenType.COMO,
  VAR: TokenType.VAR,
  VARIABLE: TokenType.VAR,
  TIPO: TokenType.TIPO,
  FIN_TIPO: TokenType.FIN_TIPO,
  FINTIPO: TokenType.FIN_TIPO,
  PROCESO: TokenType.PROCESO,
  FIN_PROCESO: TokenType.FIN_PROCESO,
  FINPROCESO: TokenType.FIN_PROCESO,
  IMPRIMIR: TokenType.IMPRIMIR,
  MOSTRAR: TokenType.IMPRIMIR,
  ESCRIBIR: TokenType.IMPRIMIR,
  PRINT: TokenType.IMPRIMIR,
  LEER: TokenType.LEER,
  INGRESAR: TokenType.LEER,

  SI: TokenType.SI,
  ENTONCES: TokenType.ENTONCES,
  SINO: TokenType.SINO,
  SINO_SI: TokenType.SINO_SI,
  SINOSI: TokenType.SINO_SI,
  FIN_SI: TokenType.FIN_SI,
  FINSI: TokenType.FIN_SI,

  MIENTRAS: TokenType.MIENTRAS,
  HACER: TokenType.HACER,
  FIN_MIENTRAS: TokenType.FIN_MIENTRAS,
  FINMIENTRAS: TokenType.FIN_MIENTRAS,
  REPETIR: TokenType.REPETIR,
  QUE: TokenType.QUE,
  HASTAQUE: TokenType.HASTA,

  PARA: TokenType.PARA,
  HASTA: TokenType.HASTA,
  PASO: TokenType.PASO,
  FIN_PARA: TokenType.FIN_PARA,
  FINPARA: TokenType.FIN_PARA,
  PAUSAR: TokenType.PAUSAR,

  // Types
  ENTERO: TokenType.T_ENTERO,
  ENETRO: TokenType.T_ENTERO,
  DECIMAL: TokenType.T_DECIMAL,
  REAL: TokenType.T_DECIMAL,
  CADENA: TokenType.T_CADENA,
  TEXTO: TokenType.T_CADENA,
  LOGICO: TokenType.T_LOGICO,
  BOOLEANO: TokenType.T_LOGICO,
  BOLEANO: TokenType.T_LOGICO,
  ARRAY: TokenType.T_ARRAY,
  MATRIZ: TokenType.T_ARRAY,
  LISTA: TokenType.T_ARRAY,

  // Booleans
  VERDADERO: TokenType.BOOLEANO,
  VERDAD: TokenType.BOOLEANO,
  FALSO: TokenType.BOOLEANO,

  // Canvas / Graphics
  DIBUJAR_CIRCULO: TokenType.DIBUJAR_CIRCULO,
  DIBUJARCIRCULO: TokenType.DIBUJAR_CIRCULO,
  DIBUJAR_RECTANGULO: TokenType.DIBUJAR_RECTANGULO,
  DIBUJARRECTANGULO: TokenType.DIBUJAR_RECTANGULO,
  DIBUJAR_LINEA: TokenType.DIBUJAR_LINEA,
  DIBUJARLINEA: TokenType.DIBUJAR_LINEA,
  LIMPIAR_CANVAS: TokenType.LIMPIAR_CANVAS,
  LIMPIARCANVAS: TokenType.LIMPIAR_CANVAS,
  COLOR_PINCEL: TokenType.COLOR_PINCEL,
  COLORPINCEL: TokenType.COLOR_PINCEL,
  TOCAR_NOTA: TokenType.TOCAR_NOTA,
  TOCARNOTA: TokenType.TOCAR_NOTA,

  // Logical operators
  Y: TokenType.Y,
  AND: TokenType.Y,
  O: TokenType.O,
  OR: TokenType.O,
  NO: TokenType.NO,
  NOT: TokenType.NO,
  ES: TokenType.IGUAL,
  NO_ES: TokenType.DIFERENTE,
  NOES: TokenType.DIFERENTE,
};
