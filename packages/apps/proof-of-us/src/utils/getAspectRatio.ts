// Helper function to calculate the greatest common divisor (GCD) using Euclidean algorithm
const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

// List of standard aspect ratios with their decimal values
const standardAspectRatios: { label: string; ratio: number }[] = [
  { label: '1/1', ratio: 1 },
  { label: '16/9', ratio: 16 / 9 },
  { label: '4/3', ratio: 4 / 3 },
  { label: '3/2', ratio: 3 / 2 },
  { label: '21/9', ratio: 21 / 9 },
  { label: '5/4', ratio: 5 / 4 },
];

export const getAspectRatio = (width: number, height: number): string => {
  // Simplify the width and height by their GCD
  const divisor = gcd(width, height);
  const simplifiedWidth = width / divisor;
  const simplifiedHeight = height / divisor;
  const aspectRatio = simplifiedWidth / simplifiedHeight;

  // Find the closest standard aspect ratio
  let closestRatio = standardAspectRatios[0];
  let smallestDifference = Math.abs(aspectRatio - closestRatio.ratio);

  for (const standard of standardAspectRatios) {
    const difference = Math.abs(aspectRatio - standard.ratio);
    if (difference < smallestDifference) {
      closestRatio = standard;
      smallestDifference = difference;
    }
  }

  // Return the closest standard ratio and the actual simplified aspect ratio
  return `${closestRatio.label}`;
};
