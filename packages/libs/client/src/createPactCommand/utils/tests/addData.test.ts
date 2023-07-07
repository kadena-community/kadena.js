import { addKeyset, readKeyset } from '../addData';

describe('readKeyset', () => {
  it('returns read-keyset string', () => {
    expect(readKeyset('ks')).toBe('(read-keyset "ks")');
  });
});

describe('addKeyset', () => {
  it('returns keyset data format', () => {
    expect(addKeyset('test', 'keys-one', 'p1', 'p2')).toEqual({
      payload: {
        exec: {
          data: {
            test: {
              publicKeys: ['p1', 'p2'],
              pred: 'keys-one',
            },
          },
        },
      },
    });
  });
});
