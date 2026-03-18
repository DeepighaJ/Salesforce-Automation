// fixtures/index.ts
// Central export — merges all fixtures into a single test instance

import { mergeTests } from '@playwright/test';
import { test as pageTest }  from './pageFixture';
import { test as tokenTest } from './generateTokenFixture';

// ── Merge both fixture tests into one ─────────────────────────────────────────
export const test = mergeTests(pageTest, tokenTest);

// ── Single expect export ───────────────────────────────────────────────────────
export { expect } from '@playwright/test';

// ── Re-export types (useful for helper files / other fixtures) ─────────────────
export type { pageFixture }    from './pageFixture';
export type { SFTokenFixture } from './generateTokenFixture';