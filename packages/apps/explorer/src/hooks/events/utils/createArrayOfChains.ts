import { CONSTANTS } from '@/constants/constants';

/**
 * receives a comma separated string, that needs to become an array of numbers
 * it could also have a range of chains (ex: 1-5)
 * @param value string | undefined
 * @returns number[]
 */
export const createArrayOfChains = (value?: string | undefined): number[] => {
  if (!value) return [];
  const chainRange = value
    .split(',')
    .map((v) => {
      //check range
      if (v.includes('-')) {
        const [min, max] = v.split('-');
        const range = [];
        for (let i = parseInt(min); i <= parseInt(max); i++) {
          range.push(i);
        }

        return range;
      }

      return parseInt(v, 10);
    })
    .flat()
    .filter((v) => v <= CONSTANTS.CHAINCOUNT && v >= 0)
    .sort((a, b) => (a > b ? 1 : -1));

  // make sure that there are no doubles
  return [...new Set(chainRange)];
};
