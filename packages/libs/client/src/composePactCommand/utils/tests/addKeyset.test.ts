import { Predicate } from '@kadena/types';
import { describe, expect, it } from 'vitest';
import { addKeyset } from '../addKeyset';

describe('addKeyset', () => {
  it('returns keyset data format', () => {
    expect(addKeyset('test', Predicate.keysAny, 'p1', 'p2')({})).toEqual({
      payload: {
        exec: {
          data: {
            test: {
              keys: ['p1', 'p2'],
              pred: Predicate.keysAny,
            },
          },
        },
      },
    });
  });
});
