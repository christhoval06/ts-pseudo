import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { Header } from '../src/components/Header';

const html = renderToStaticMarkup(
  <Header
    isRunning={false}
    isPaused={false}
    onRun={() => undefined}
    onStop={() => undefined}
    onStep={() => undefined}
    onSelectExample={() => undefined}
    onOpenPlan={() => undefined}
    onSavePcode={() => undefined}
    onOpenPcode={() => undefined}
    stepDelay={500}
    setStepDelay={() => undefined}
  />
);

const toolbarMatches = html.match(/role="toolbar"/g) ?? [];

assert.equal(
  toolbarMatches.length,
  1,
  'Header should expose one compact toolbar instead of multiple grouped bars.'
);
assert.match(
  html,
  /aria-label="Controles principales"/,
  'The compact toolbar should be named for assistive technology.'
);
