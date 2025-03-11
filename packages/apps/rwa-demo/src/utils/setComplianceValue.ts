//check that the string is actually a number
export const setComplianceValue = (
  value: string | number | undefined,
  defaultValue?: string | number,
): string => {
  const number = parseInt(`${value ?? 0}`);
  const defaultNumber = parseInt(`${defaultValue}`);
  return number >= 0
    ? `${number}`
    : !Number.isNaN(defaultNumber)
      ? `${defaultValue}`
      : '';
};
