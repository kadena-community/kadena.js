import { addKeyset } from '../addKeyset';

describe('addKeyset', () => {
  it('returns keyset data format', () => {
    expect(addKeyset('test', 'keys-one', 'p1', 'p2')({})).toEqual({
      payload: {
        exec: {
          data: {
            test: {
              keys: ['p1', 'p2'],
              pred: 'keys-one',
            },
          },
        },
      },
    });
  });
});
