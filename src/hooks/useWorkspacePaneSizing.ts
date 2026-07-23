import { KeyboardEvent, useEffect, useRef, useState } from 'react';

import {
  WORKSPACE_PANE_WIDTHS,
  adjustEditorWidthWithKeyboard,
  calculateEditorWidthFromPointer,
} from '../utils/workspacePaneSizing';


export function useWorkspacePaneSizing() {
  const [editorWidthPercent, setEditorWidthPercent] = useState<number>(
    WORKSPACE_PANE_WIDTHS.balanced
  );
  const [isResizing, setIsResizing] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isResizing) return;
    const handlePointerMove = (event: PointerEvent) => {
      const bounds = workspaceRef.current?.getBoundingClientRect();
      if (!bounds) return;
      setEditorWidthPercent(
        calculateEditorWidthFromPointer(event.clientX, bounds.left, bounds.width)
      );
    };
    const handlePointerUp = () => setIsResizing(false);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isResizing]);

  const handleResizeKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    setEditorWidthPercent((width) =>
      adjustEditorWidthWithKeyboard(width, event.key === 'ArrowLeft' ? 'left' : 'right')
    );
  };

  return {
    workspaceRef,
    editorWidthPercent,
    isResizing,
    handleResizeKeyDown,
    startResizing: () => setIsResizing(true),
  };
}
