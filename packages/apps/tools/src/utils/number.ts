export function formatNumberAsString(value: number): string {
  return value.toLocaleString('en-US', {
    useGrouping: false,
    minimumFractionDigits: 1,
    maximumFractionDigits: 12,
  });
}
