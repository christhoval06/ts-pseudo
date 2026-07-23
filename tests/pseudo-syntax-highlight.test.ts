import assert from 'node:assert/strict';

import { SPANISH_KEYWORDS } from '../src/compiler/tokens';
import { pseudoHighlightedKeywords } from '../src/hooks/usePseudoSyntaxHighlight';

const missingKeywords = Object.keys(SPANISH_KEYWORDS).filter(
  (keyword) => !pseudoHighlightedKeywords.includes(keyword)
);

assert.deepEqual(
  missingKeywords,
  [],
  `Pseudo syntax highlighter is missing lexer keywords: ${missingKeywords.join(', ')}`
);
