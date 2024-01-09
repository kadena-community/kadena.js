import { getClassName } from '../getClassName';

describe('utils getClassName', () => {
  it('should return the correct className from string', () => {
    expect(getClassName('he-man')).toEqual('.he-man');
  });
});
