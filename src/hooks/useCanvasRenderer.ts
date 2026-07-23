import { useEffect, RefObject } from 'react';

import { CanvasCommandItem } from '../components/CanvasDisplay';

const numericArgs = (args: unknown[]) => args.map((arg) => (typeof arg === 'number' ? arg : Number(arg) || 0));

export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  commands: CanvasCommandItem[]
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.strokeStyle = '#6366f1';
    ctx.fillStyle = '#6366f1';
    ctx.lineWidth = 3;

    for (const { command, args } of commands) {
      if (command === 'LIMPIAR_CANVAS') ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (command === 'COLOR_PINCEL' && args[0]) {
        ctx.fillStyle = String(args[0]);
        ctx.strokeStyle = String(args[0]);
      }
      if (command === 'DIBUJAR_CIRCULO') {
        const [x = 200, y = 150, r = 50] = numericArgs(args);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      if (command === 'DIBUJAR_RECTANGULO') {
        const [x = 10, y = 10, w = 100, h = 100] = numericArgs(args);
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
      }
      if (command === 'DIBUJAR_LINEA') {
        const [x1 = 0, y1 = 0, x2 = 100, y2 = 100] = numericArgs(args);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
  }, [canvasRef, commands]);
}
