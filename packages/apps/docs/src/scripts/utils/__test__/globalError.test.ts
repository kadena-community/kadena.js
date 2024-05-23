import { getGlobalError, setGlobalError } from '../globalError';

describe('globalError', () => {
  it('should set the value of globalerror to true', () => {
    expect(getGlobalError()).toBe(false);
    setGlobalError(true);
    expect(getGlobalError()).toBe(true);
  });
});
