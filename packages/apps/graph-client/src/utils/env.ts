export const env: {
  MAX_CALCULATED_CONFIRMATION_DEPTH: number;
} = {
  MAX_CALCULATED_CONFIRMATION_DEPTH: parseInt(
    or(process.env.NEXT_PUBLIC_MAX_CALCULATED_CONFIRMATION_DEPTH, '7'),
    10,
  ),
};

function or<T>(value: T | undefined, otherwise: T): T {
  return value === undefined ? otherwise : value;
}
