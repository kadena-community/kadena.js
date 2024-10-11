// Helper function to calculate the greatest common divisor (GCD) using Euclidean algorithm
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

export const getAspectRatio = (width: number, height: number): string => {
  const divisor = gcd(width, height);
  const simplifiedWidth = width / divisor;
  const simplifiedHeight = height / divisor;
  return `${simplifiedWidth}/${simplifiedHeight}`;
};
