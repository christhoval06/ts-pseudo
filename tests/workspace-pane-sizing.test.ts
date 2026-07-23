import assert from 'node:assert/strict';
import test from 'node:test';

import {
  WORKSPACE_PANE_WIDTHS,
  adjustEditorWidthWithKeyboard,
  calculateEditorWidthFromPointer,
  clampEditorWidthPercent,
} from '../src/utils/workspacePaneSizing';

test('defines expected preset widths', () => {
  assert.equal(WORKSPACE_PANE_WIDTHS.editor, 70);
  assert.equal(WORKSPACE_PANE_WIDTHS.balanced, 58);
  assert.equal(WORKSPACE_PANE_WIDTHS.console, 42);
});

test('clamps editor width to usable desktop bounds', () => {
  assert.equal(clampEditorWidthPercent(20), 35);
  assert.equal(clampEditorWidthPercent(50), 50);
  assert.equal(clampEditorWidthPercent(90), 75);
});

test('calculates editor width from pointer position', () => {
  assert.equal(calculateEditorWidthFromPointer(700, 100, 1000), 60);
});

test('keyboard adjustment changes width in clamped steps', () => {
  assert.equal(adjustEditorWidthWithKeyboard(58, 'left'), 56);
  assert.equal(adjustEditorWidthWithKeyboard(58, 'right'), 60);
  assert.equal(adjustEditorWidthWithKeyboard(35, 'left'), 35);
  assert.equal(adjustEditorWidthWithKeyboard(75, 'right'), 75);
});
