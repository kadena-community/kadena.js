import { CONSTANTS } from '@/constants/constants';

/**
 * receives a comma separated string, that needs to become an array of numbers
 * @param value string | undefined
 * @returns number[]
 */
export const createArrayOfChains = (value?: string | undefined): number[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => parseInt(v, 10))
    .filter((v) => v <= CONSTANTS.CHAINCOUNT && v >= 0)
    .sort((a, b) => (a > b ? 1 : -1));
};
