# ts-pseudo

## English

`ts-pseudo` is a browser-based pseudocode IDE for learning programming concepts in Spanish. It combines a CodeMirror editor, a custom lexer/parser/interpreter, live execution output, canvas drawing commands, sound commands, variable inspection, and built-in examples.

The app is built with React, TypeScript, and Vite.

### Features

- Write and run Spanish-style pseudocode in the browser.
- Use bundled examples for beginner programs, control flow, arrays, records, functions, visual output, and sound.
- View console output, canvas commands, and runtime variables while programs execute.
- Import and export `.pcode` programs.
- See active execution lines and parse/runtime errors in the editor.
- Inspect generated TypeScript/JavaScript output from the transpiler.

### Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

### Available Scripts

- `npm run dev` starts the Vite development server.
- `npm run build` type-checks the project and creates a production build.
- `npm test` runs the main compiler test file.
- `npm run lint` runs ESLint.
- `npm run format` formats source files with Prettier.
- `npm run preview` serves the built app locally.

Additional test files live in `tests/` and can be run directly with `tsx`, for example:

```bash
npx tsx tests/compiler-loops.test.ts
```

### Project Structure

```text
src/
  compiler/     Lexer, parser, AST, interpreter, transpiler, and examples
  components/   React UI components for the editor, header, output panes, and modals
  hooks/        Runtime, editor, file, canvas, sound, and workspace behavior
  data/         UI data such as completions and planning modal content
  types/        Shared TypeScript application types
  utils/        Pseudocode indentation, validation, file, and layout helpers
tests/          Focused tests for compiler behavior and UI utilities
```

### Pseudocode Support

The compiler and interpreter support core constructs such as:

- `Inicio` / `Fin` program blocks
- `Definir` variable declarations and `Constante` declarations
- Assignment with `<-`
- `Si` / `Sino` / `FinSi`
- `Mientras`, `Repetir ... Hasta Que`, and `Para`
- Arrays and matrices
- Records and custom types
- Procedures and functions
- `Leer` and `Imprimir`
- Built-in helpers such as `ALEATORIO`, `LONGITUD`, `RAIZ`, and `ABS`
- Canvas and sound commands used by the visual examples

### Development Notes

This project currently keeps the language implementation in `src/compiler/` and the browser runtime orchestration in `src/hooks/usePseudoRuntime.ts`. When adding language features, update the lexer, parser, AST, interpreter, transpiler, examples, and relevant tests together.

## Español

`ts-pseudo` es un IDE de pseudocódigo en el navegador para aprender conceptos de programación en español. Combina un editor CodeMirror, un lexer/parser/intérprete propio, salida de ejecución en vivo, comandos de dibujo en canvas, comandos de sonido, inspección de variables y ejemplos integrados.

La aplicación está construida con React, TypeScript y Vite.

### Funcionalidades

- Escribir y ejecutar pseudocódigo en español desde el navegador.
- Usar ejemplos incluidos para programas iniciales, control de flujo, arreglos, registros, funciones, salida visual y sonido.
- Ver la salida de consola, los comandos de canvas y las variables en tiempo de ejecución.
- Importar y exportar programas `.pcode`.
- Ver la línea activa de ejecución y errores de análisis o ejecución en el editor.
- Inspeccionar el TypeScript/JavaScript generado por el transpiler.

### Primeros Pasos

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Genera una build de producción:

```bash
npm run build
```

Previsualiza la build de producción:

```bash
npm run preview
```

### Scripts Disponibles

- `npm run dev` inicia el servidor de desarrollo de Vite.
- `npm run build` revisa los tipos del proyecto y genera una build de producción.
- `npm test` ejecuta el archivo principal de pruebas del compilador.
- `npm run lint` ejecuta ESLint.
- `npm run format` formatea los archivos fuente con Prettier.
- `npm run preview` sirve la aplicación compilada de forma local.

Hay pruebas adicionales en `tests/` y se pueden ejecutar directamente con `tsx`, por ejemplo:

```bash
npx tsx tests/compiler-loops.test.ts
```

### Estructura del Proyecto

```text
src/
  compiler/     Lexer, parser, AST, intérprete, transpiler y ejemplos
  components/   Componentes React para editor, header, paneles de salida y modales
  hooks/        Runtime, editor, archivos, canvas, sonido y comportamiento del workspace
  data/         Datos de UI como autocompletados y contenido del modal de planificación
  types/        Tipos compartidos de la aplicación
  utils/        Indentación, validación, archivos y helpers de layout
tests/          Pruebas enfocadas en el compilador y utilidades de UI
```

### Soporte de Pseudocódigo

El compilador y el intérprete soportan construcciones principales como:

- Bloques de programa `Inicio` / `Fin`
- Declaraciones de variables con `Definir` y constantes con `Constante`
- Asignación con `<-`
- `Si` / `Sino` / `FinSi`
- `Mientras`, `Repetir ... Hasta Que` y `Para`
- Arreglos y matrices
- Registros y tipos personalizados
- Procedimientos y funciones
- `Leer` e `Imprimir`
- Helpers integrados como `ALEATORIO`, `LONGITUD`, `RAIZ` y `ABS`
- Comandos de canvas y sonido usados por los ejemplos visuales

### Notas de Desarrollo

La implementación del lenguaje vive principalmente en `src/compiler/` y la orquestación del runtime del navegador en `src/hooks/usePseudoRuntime.ts`. Al agregar funcionalidades del lenguaje, conviene actualizar juntos el lexer, parser, AST, intérprete, transpiler, ejemplos y pruebas relevantes.
