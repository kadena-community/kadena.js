import type { IPactCommand } from '../IPactCommand';
import { isExecCommand } from '../isExecCommand';

describe('isExecCommand', () => {
  it('returns true if payload is exec', () => {
    expect(
      isExecCommand({ payload: { exec: { code: 'test' } } } as IPactCommand),
    ).toBe(true);
  });
  it('returns false if payload is not exec', () => {
    expect(
      isExecCommand({ payload: { cont: { pactId: '1' } } } as IPactCommand),
    ).toBe(false);
  });
});
