import { sum } from '..';

//@TODO: remove this, this is just for testing purposes, see that everything works
describe('utils test', () => {
  test('sum', () => {
    expect(sum(1, 2)).toEqual(3);
  });
});
