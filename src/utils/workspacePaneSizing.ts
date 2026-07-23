export const WORKSPACE_PANE_WIDTHS = {
  editor: 70,
  balanced: 58,
  console: 42,
} as const;

const MIN_EDITOR_WIDTH_PERCENT = 35;
const MAX_EDITOR_WIDTH_PERCENT = 75;
const KEYBOARD_STEP_PERCENT = 2;

export function clampEditorWidthPercent(value: number) {
  return Math.min(MAX_EDITOR_WIDTH_PERCENT, Math.max(MIN_EDITOR_WIDTH_PERCENT, value));
}

export function calculateEditorWidthFromPointer(
  clientX: number,
  containerLeft: number,
  containerWidth: number
) {
  if (containerWidth <= 0) return 58;

  const rawPercent = ((clientX - containerLeft) / containerWidth) * 100;
  return clampEditorWidthPercent(Math.round(rawPercent));
}

export function adjustEditorWidthWithKeyboard(
  currentWidth: number,
  direction: 'left' | 'right'
) {
  const delta = direction === 'left' ? -KEYBOARD_STEP_PERCENT : KEYBOARD_STEP_PERCENT;
  return clampEditorWidthPercent(currentWidth + delta);
}
