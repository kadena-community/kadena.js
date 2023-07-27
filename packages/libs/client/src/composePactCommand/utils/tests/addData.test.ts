import { addData, addKeyset } from '../addData';

describe('addData', () => {
  it('add data for exec payload', () => {
    expect(
      addData('test', 'value')({ payload: { exec: { code: '(func)' } } }),
    ).toEqual({
      payload: { exec: { code: '(func)', data: { test: 'value' } } },
    });
  });

  it('add data for cont payload', () => {
    expect(
      addData('test', 'value')({ payload: { cont: { pactId: '1' } } }),
    ).toEqual({
      payload: { cont: { pactId: '1', data: { test: 'value' } } },
    });
  });

  it('return data for exec payload if input does not have payload', () => {
    expect(addData('test', 'value')({})).toEqual({
      payload: { exec: { data: { test: 'value' } } },
    });
  });
});

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
