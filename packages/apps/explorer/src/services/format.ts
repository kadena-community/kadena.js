export function formatNumberWithUnit(number: number, unit?: string): string {
  if (number === 0) {
    return `0 ${unit ? unit : ''}`;
  }
  const units = ['', 'K', 'M', 'B', 'T', 'P', 'E'];
  const unitIndex = Math.floor(Math.log10(Math.abs(number)) / 3);
  const formattedNumber = (number / Math.pow(1000, unitIndex)).toFixed(2);
  return `${formattedNumber} ${units[unitIndex]}${unit ? unit : ''}`;
}
