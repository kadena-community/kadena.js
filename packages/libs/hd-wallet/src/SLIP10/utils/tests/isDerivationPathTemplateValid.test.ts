import { describe, expect, it } from 'vitest';
import { isDerivationPathTemplateValid } from '../isDerivationPathTemplateValid.js';

describe('isDerivationPathTemplateValid', () => {
  it("should return true if derivationPathTemplate is a string and includes '<index>'", () => {
    expect(isDerivationPathTemplateValid("m'/44'/626'/<index>'")).toBe(true);
  });
  it('should return false if derivationPathTemplate is not a string', () => {
    expect(isDerivationPathTemplateValid(123 as unknown as string)).toBe(false);
  });
  it("should return false if derivationPathTemplate does not include '<index>'", () => {
    expect(isDerivationPathTemplateValid("m'/44'/626'/index'")).toBe(false);
  });
  it('returns false if derivationPathTemplate is an empty string', () => {
    expect(isDerivationPathTemplateValid('')).toBe(false);
  });
});
