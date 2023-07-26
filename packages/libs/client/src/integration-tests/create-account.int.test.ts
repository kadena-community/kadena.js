import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('top level test', () => {
  it('subtest 1', () => {
    assert.strictEqual(1, 1);
  });

  it('subtest 2', () => {
    assert.strictEqual(2, 2);
  });
});
