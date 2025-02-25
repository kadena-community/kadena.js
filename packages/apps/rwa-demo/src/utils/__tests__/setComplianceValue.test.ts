import { setComplianceValue } from '../setComplianceValue';

describe('setComplianceValue utils', () => {
  it('should return the value as a string when value is = 0', () => {
    expect(setComplianceValue(5)).toEqual('5');
    expect(setComplianceValue('12')).toEqual('12');
  });
  it('should return the value as a string when value is === 0', () => {
    expect(setComplianceValue(0)).toEqual('0');
    expect(setComplianceValue('0')).toEqual('0');
  });
  it('should return empty string when value is < 0', () => {
    expect(setComplianceValue(-12)).toEqual('');
    expect(setComplianceValue('-13')).toEqual('');
  });
  it('should return defaultValue when value is < 0 and defaultValue is given', () => {
    expect(setComplianceValue(-12, 1)).toEqual('1');
    expect(setComplianceValue(-12, 0)).toEqual('0');
    expect(setComplianceValue('-13', '2')).toEqual('2');
    expect(setComplianceValue('-13', 'he-man')).toEqual('');
  });
});
