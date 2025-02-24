export const setComplianceValue = (
  value: string | number | undefined,
  defaultValue?: string | number,
): string => {
  const number = parseInt(`${value ?? 0}`);
  const defaultNumber = parseInt(`${defaultValue}`);
  return number >= 0
    ? `${number}`
    : defaultNumber >= 0
      ? `${defaultValue}`
      : '';
};
