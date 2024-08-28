import { cleanVersionLabel } from '../cleanVersionLabel';

describe('cleanVersionLabel', () => {
  it('should return the label if it is just the label', () => {
    const result = cleanVersionLabel('1.0.0');
    expect(result).toBe('1.0.0');
  });

  it('should return the label without everything in ()', () => {
    const result = cleanVersionLabel('1.0.0 (1977-10-13)');
    expect(result).toBe('1.0.0');
  });
});
