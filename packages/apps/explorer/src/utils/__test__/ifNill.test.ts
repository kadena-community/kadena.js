import { ifNill } from '../ifNill';

describe('ifNill', () => {
  it('should return the value if given', () => {
    const result = ifNill('2', 'true');
    expect(result).toEqual('2');
  });

  it('should return the fallback value if value is not given', () => {
    expect(ifNill(null, true)).toEqual(true);
    expect(ifNill(undefined, true)).toEqual(true);
  });
});
