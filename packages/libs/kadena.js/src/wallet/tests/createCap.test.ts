import { describe, expect, it } from 'vitest';
import { createCap } from '../createCap';

describe('createCap', () => {
  it('Takes in Pact Capability arguments and outputs Pact Capability object', () => {
    const actual = createCap(
      'Gas',
      'Grants gas payment capability',
      'coin.GAS',
      [],
    );
    const expected = {
      role: 'Gas',
      description: 'Grants gas payment capability',
      cap: {
        name: 'coin.GAS',
        args: [],
      },
    };
    expect(expected).toEqual(actual);
  });

  it('has a default value for args', () => {
    const actual = createCap(
      'Gas',
      'Grants gas payment capability',
      'coin.GAS',
      [],
    );
    const expected = {
      role: 'Gas',
      description: 'Grants gas payment capability',
      cap: {
        name: 'coin.GAS',
        args: [],
      },
    };
    expect(expected).toEqual(actual);
  });
});
