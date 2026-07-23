export interface CodeExample {
  id: string;
  title: string;
  description: string;
  category:
    | 'Principiante'
    | 'Control de Flujo'
    | 'Arrays'
    | 'Registros'
    | 'Funciones'
    | 'Visual & Sonido';
  code: string;
}

export const EXAMPLES: CodeExample[] = [
  {
    id: 'hola-mundo',
    title: '1. ¡Hola Mundo Interactivo!',
    description: 'Aprende a definir variables con Definir ... Como ... y asignar con <-',
    category: 'Principiante',
    code: `// Ejemplo 1: Definición y Asignación de Variables
Inicio
  Definir nombre Como Texto
  Definir edad Como Entero

  Leer("¿Cuál es tu nombre?", nombre)
  Leer("¿Cuántos años tienes?", edad)

  Imprimir("¡Hola", nombre, "! Tienes", edad, "años.")
  Imprimir("¡Felicidades por comenzar tu camino en la programación! 🚀")
Fin
`,
  },
  {
    id: 'adivina-numero',
    title: '2. Juego: Adivina el Número 🎲',
    description: 'Usa Definir nombre Como Entero, asignación <- y bucles Mientras',
    category: 'Control de Flujo',
    code: `// Ejemplo 2: Juego de adivinar el número
Inicio
  Definir secreto Como Entero
  Definir intento Como Entero
  Definir contador Como Entero
  Definir adivinado Como Logico

  secreto <- ALEATORIO(1, 20)
  intento <- 0
  contador <- 0
  adivinado <- Falso

  Imprimir("🎮 ¡Bienvenido al Juego de Adivinar!")
  Imprimir("He pensado un número secreto entre 1 y 20.")

  Mientras adivinado == Falso Hacer
    Leer("Introduce tu número:", intento)
    contador <- contador + 1

    Si intento == secreto Entonces
      Imprimir("🎉 ¡EXTRAORDINARIO! ¡Adivinaste en", contador, "intentos!")
      adivinado <- Verdadero
    Sino
      Si intento < secreto Entonces
        Imprimir("⬆️ El número secreto es MAYOR que", intento)
      Sino
        Imprimir("⬇️ El número secreto es MENOR que", intento)
      FinSi
    FinSi
  FinMientras
Fin
`,
  },
  {
    id: 'tabla-multiplicar',
    title: '3. Tabla de Multiplicar (Bucle Para)',
    description: 'Repite instrucciones fácilmente asignando valores con <-',
    category: 'Control de Flujo',
    code: `// Ejemplo 3: Generador de tablas de multiplicar
Inicio
  Definir tabla Como Entero
  Definir i Como Entero
  Definir resultado Como Entero

  tabla <- 7
  i <- 1
  resultado <- 0

  Imprimir("📊 Tabla de multiplicar del número", tabla)

  Para i <- 1 Hasta 10 Paso 1 Hacer
    resultado <- tabla * i
    Imprimir(tabla, "x", i, "=", resultado)
  FinPara

  Imprimir("✅ ¡Tabla completada con éxito!")
Fin
`,
  },
  {
    id: 'listas-arrays',
    title: '4. Arreglos y Listas de Superhéroes 🦸',
    description: 'Manejo de colecciones con Definir heroes Como Matriz',
    category: 'Arrays',
    code: `// Ejemplo 4: Trabajando con Arreglos (Arrays)
Inicio
  Definir heroes Como Matriz
  heroes <- ["Spider-Man", "Iron Man", "Capitana Marvel", "Batman"]

  Definir total Como Entero
  total <- LONGITUD(heroes)

  Definir i Como Entero
  i <- 0

  Imprimir("🦸‍♂️ Total de superhéroes en el equipo:", total)

  Para i <- 0 Hasta total - 1 Paso 1 Hacer
    Imprimir("Héroe #", i + 1, ":", heroes[i])
  FinPara

  Imprimir("--- Añadiendo a un nuevo integrante ---")
  heroes[0] <- "Spider-Gwen"
  Imprimir("Nuevo líder del equipo:", heroes[0])
Fin
`,
  },
  {
    id: 'arreglo-edades',
    title: '5. Arreglo: Edades por Posición',
    description: 'Declara un arreglo con tamaño fijo usando nombre[tamaño]',
    category: 'Arrays',
    code: `// Ejemplo 5: Arreglo de edades con tamaño fijo
Inicio
  Definir edades[5] Como Entero

  edades[0] <- 12
  edades[1] <- 15
  edades[2] <- 18
  edades[3] <- 21
  edades[4] <- 24

  Imprimir("Primera edad:", edades[0])
  Imprimir("Última edad:", edades[4])

  Para i <- 0 Hasta 4 Paso 1 Hacer
    Imprimir("Edad en posición", i, "=", edades[i])
  FinPara
Fin
`,
  },
  {
    id: 'matriz-notas',
    title: '6. Matriz: Notas por Fila y Columna',
    description: 'Declara una matriz con filas y columnas usando nombre[filas, columnas]',
    category: 'Arrays',
    code: `// Ejemplo 6: Matriz de notas con filas y columnas
Inicio
  Definir notas[2, 3] Como Decimal

  notas[0,0] <- 8.5
  notas[0,1] <- 9.0
  notas[0,2] <- 7.5
  notas[1,0] <- 10.0
  notas[1,1] <- 8.0
  notas[1,2] <- 9.5

  Imprimir("Nota fila 0 columna 0:", notas[0,0])
  Imprimir("Nota fila 1 columna 2:", notas[1,2])

  Para fila <- 0 Hasta 1 Paso 1 Hacer
    Para columna <- 0 Hasta 2 Paso 1 Hacer
      Imprimir("notas[", fila, ",", columna, "] =", notas[fila,columna])
    FinPara
  FinPara
Fin
`,
  },
  {
    id: 'matriz-tesoro-trampas',
    title: '7. Matriz: Tesoro con Trampas',
    description:
      'Usa constantes FILAS, COLUMNAS y VIDAS_INICIALES para recorrer un tablero con tesoro y trampas',
    category: 'Arrays',
    code: `// Ejemplo 7: Buscar el tesoro en una matriz con trampas
Constante FILAS Como Entero <- 3
Constante COLUMNAS Como Entero <- 3
Constante VIDAS_INICIALES Como Entero <- 3

Inicio
  Definir tablero[FILAS, COLUMNAS] Como Texto
  Definir rutaFilas[5] Como Entero
  Definir rutaColumnas[5] Como Entero
  Definir fila Como Entero
  Definir columna Como Entero
  Definir movimiento Como Entero
  Definir vidas Como Entero
  Definir encontroTesoro Como Logico

  Para fila <- 0 Hasta FILAS - 1 Paso 1 Hacer
    Para columna <- 0 Hasta COLUMNAS - 1 Paso 1 Hacer
      tablero[fila,columna] <- "."
    FinPara
  FinPara

  tablero[0,2] <- "T"
  tablero[1,1] <- "X"
  tablero[2,0] <- "X"

  rutaFilas[0] <- 0
  rutaColumnas[0] <- 0
  rutaFilas[1] <- 1
  rutaColumnas[1] <- 1
  rutaFilas[2] <- 2
  rutaColumnas[2] <- 1
  rutaFilas[3] <- 2
  rutaColumnas[3] <- 0
  rutaFilas[4] <- 0
  rutaColumnas[4] <- 2

  vidas <- VIDAS_INICIALES
  encontroTesoro <- Falso
  movimiento <- 0

  Imprimir("Mapa secreto:", FILAS, "x", COLUMNAS)
  Imprimir("Vidas iniciales:", vidas)

  Mientras movimiento < 5 Y vidas > 0 Y encontroTesoro == Falso Hacer
    fila <- rutaFilas[movimiento]
    columna <- rutaColumnas[movimiento]

    Imprimir("Explorando fila", fila, "columna", columna)

    Si tablero[fila,columna] == "T" Entonces
      encontroTesoro <- Verdadero
      Imprimir("Tesoro encontrado con", vidas, "vidas restantes")
    Sino
      Si tablero[fila,columna] == "X" Entonces
        vidas <- vidas - 1
        Imprimir("Trampa oculta. Vidas restantes:", vidas)
      Sino
        Imprimir("Casilla segura. Sigue buscando.")
      FinSi
    FinSi

    movimiento <- movimiento + 1
  FinMientras

  Si encontroTesoro == Falso Entonces
    Imprimir("No encontraste el tesoro esta vez.")
  FinSi
Fin
`,
  },
  {
    id: 'dibujo-canvas',
    title: '8. Canvas: ¡Dibujando con Código! 🎨',
    description: 'Crea figuras geométricas coloridas en la pantalla visual',
    category: 'Visual & Sonido',
    code: `// Ejemplo 8: Arte y Dibujo Canvas
Inicio
  LimpiarCanvas()

  // Fondo del cuadro
  ColorPincel("#1e1b4b")
  DibujarRectangulo(0, 0, 400, 300)

  // Círculos concéntricos de colores
  ColorPincel("#ec4899")
  DibujarCirculo(200, 150, 90)

  ColorPincel("#8b5cf6")
  DibujarCirculo(200, 150, 60)

  ColorPincel("#06b6d4")
  DibujarCirculo(200, 150, 30)

  // Líneas decorativas
  ColorPincel("#facc15")
  DibujarLinea(50, 50, 350, 250)
  DibujarLinea(50, 250, 350, 50)

  Imprimir("🎨 ¡Obra de arte creada exitosamente en el Canvas!")
Fin
`,
  },
  {
    id: 'sonido-musica',
    title: '9. Creador de Melodías y Notas 🎵',
    description: 'Genera sonidos y melodías usando la instrucción TocarNota',
    category: 'Visual & Sonido',
    code: `// Ejemplo 9: Melodía de notas musicales
Inicio
  Imprimir("🎵 Tocando escala musical alegre...")

  TocarNota(261.63, 300) // Do
  PAUSAR(100)
  TocarNota(293.66, 300) // Re
  PAUSAR(100)
  TocarNota(329.63, 300) // Mi
  PAUSAR(100)
  TocarNota(349.23, 300) // Fa
  PAUSAR(100)
  TocarNota(392.00, 500) // Sol

  Imprimir("🎶 ¡Melodía finalizada!")
Fin
`,
  },
  {
    id: 'procesos-saludos',
    title: '10. Procesos con Parámetros',
    description: 'Organiza instrucciones reutilizables con Proceso ... FinProceso',
    category: 'Funciones',
    code: `// Ejemplo 10: Crear y usar procesos con parámetros
Proceso saludar(nombre Como Texto)
  Imprimir("Hola", nombre, "!")
FinProceso

Proceso mostrarDoble(numero Como Entero)
  Definir doble Como Entero
  doble <- numero * 2
  Imprimir("El doble de", numero, "es", doble)
FinProceso

Inicio
  saludar("Ana")
  saludar("Luis")
  mostrarDoble(8)
Fin
`,
  },
  {
    id: 'tipo-estudiante',
    title: '11. Registros: Tipo Estudiante',
    description: 'Crea estructuras tipo JSON con campos y accede usando punto',
    category: 'Registros',
    code: `// Ejemplo 11: Registros personalizados con Tipo
Tipo Estudiante
  nombre Como Texto
  edad Como Entero
  promedio Como Decimal
FinTipo

Inicio
  Definir alumno Como Estudiante

  alumno.nombre <- "Luis"
  alumno.edad <- 18
  alumno.promedio <- 9.5

  Imprimir("Nombre:", alumno.nombre)
  Imprimir("Edad:", alumno.edad)
  Imprimir("Promedio:", alumno.promedio)
Fin
`,
  },
  {
    id: 'constantes-configuracion',
    title: '12. Constantes: Valores Fijos',
    description: 'Declara valores que no cambian con Constante ... Como ... <-',
    category: 'Principiante',
    code: `// Ejemplo 12: Constantes para valores fijos
Constante NOMBRE_APP Como Texto <- "PseudoLab"
Constante MAX_INTENTOS Como Entero <- 3
Constante PI Como Decimal <- 3.14

Inicio
  Definir radio Como Decimal
  Definir area Como Decimal

  radio <- 5
  area <- PI * radio * radio

  Imprimir("Aplicación:", NOMBRE_APP)
  Imprimir("Intentos permitidos:", MAX_INTENTOS)
  Imprimir("Área aproximada del círculo:", area)

  // Si intentas hacer PI <- 4, el intérprete mostrará un error.
Fin
`,
  },
  {
    id: 'control-si',
    title: '13. Control: Si ... Sino',
    description: 'Toma decisiones con Si ... Entonces, Sino y FinSi',
    category: 'Control de Flujo',
    code: `// Ejemplo 13: Condicional Si ... Sino
Inicio
  Definir edad Como Entero

  edad <- 16

  Si edad >= 18 Entonces
    Imprimir("Puede votar")
  Sino
    Imprimir("Aún no puede votar")
  FinSi
Fin
`,
  },
  {
    id: 'control-si-anidado',
    title: '14. Control: Si Anidado',
    description: 'Coloca un Si dentro de otro Si para revisar más condiciones',
    category: 'Control de Flujo',
    code: `// Ejemplo 14: Condicionales Si anidados
Inicio
  Definir nota Como Entero

  nota <- 92

  Si nota >= 70 Entonces
    Imprimir("Aprobado")

    Si nota >= 90 Entonces
      Imprimir("Resultado excelente")
    Sino
      Si nota >= 80 Entonces
        Imprimir("Muy buen resultado")
      Sino
        Imprimir("Buen resultado")
      FinSi
    FinSi
  Sino
    Imprimir("Debe practicar más")
  FinSi
Fin
`,
  },
  {
    id: 'control-mientras',
    title: '15. Control: Mientras ... Hacer',
    description: 'Repite instrucciones mientras una condición sea verdadera',
    category: 'Control de Flujo',
    code: `// Ejemplo 15: Bucle Mientras ... Hacer
Inicio
  Definir contador Como Entero

  contador <- 1

  Mientras contador <= 5 Hacer
    Imprimir("Contador:", contador)
    contador <- contador + 1
  FinMientras
Fin
`,
  },
  {
    id: 'control-repetir',
    title: '16. Control: Repetir ... HastaQue',
    description: 'Ejecuta el bloque al menos una vez y se detiene al cumplir la condición',
    category: 'Control de Flujo',
    code: `// Ejemplo 16: Bucle Repetir ... HastaQue
Inicio
  Definir intento Como Entero

  intento <- 0

  Repetir
    intento <- intento + 1
    Imprimir("Intento número", intento)
  HastaQue intento == 3
Fin
`,
  },
  {
    id: 'control-para',
    title: '17. Control: Para ... Hacer',
    description: 'Cuenta desde un valor inicial hasta un valor final con Paso',
    category: 'Control de Flujo',
    code: `// Ejemplo 17: Bucle Para ... Hacer
Inicio
  Definir total Como Entero

  total <- 0

  Para i <- 1 Hasta 3 Paso 1 Hacer
    total <- total + i
    Imprimir("i =", i, "total =", total)
  FinPara

  Imprimir("Total final:", total)
Fin
`,
  },
  {
    id: 'ocarina-bosque',
    title: '18. Ocarina: Melodía de Bosque',
    description: 'Crea una melodía original estilo aventura usando TocarNota y PAUSAR',
    category: 'Visual & Sonido',
    code: `// Ejemplo 18: Melodía original para ocarina
Inicio
  Constante D4 Como Decimal <- 293.66
  Constante E4 Como Decimal <- 329.63
  Constante F4 Como Decimal <- 349.23
  Constante G4 Como Decimal <- 392.00
  Constante A4 Como Decimal <- 440.00
  Constante C5 Como Decimal <- 523.25

  Imprimir("Tocando una melodía de bosque...")

  TocarNota(D4, 180)
  PAUSAR(60)
  TocarNota(F4, 180)
  PAUSAR(60)
  TocarNota(A4, 180)
  PAUSAR(60)
  TocarNota(G4, 300)
  PAUSAR(100)

  TocarNota(E4, 180)
  PAUSAR(60)
  TocarNota(G4, 180)
  PAUSAR(60)
  TocarNota(C5, 180)
  PAUSAR(60)
  TocarNota(A4, 300)
  PAUSAR(140)

  TocarNota(F4, 160)
  PAUSAR(50)
  TocarNota(E4, 160)
  PAUSAR(50)
  TocarNota(D4, 160)
  PAUSAR(50)
  TocarNota(G4, 220)
  PAUSAR(80)
  TocarNota(A4, 420)

  Imprimir("Melodía finalizada.")
Fin
`,
  },
];
