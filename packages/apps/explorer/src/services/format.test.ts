import { truncateValues } from '@/services/format';
import { describe, expect, it } from 'vitest';

describe('truncateValues', () => {
  describe('truncates', () => {
    // input, options, expected
    (
      [
        [
          `using defaults`,
          `Lorem ipsum dolor sit amet`,
          {},
          `Lorem ipsum dolor …`,
        ],
        [
          `with length 10 and longer sentence`,
          `Lorem ipsum dolor sit amet`,
          { length: 10 },
          `Lorem ipsu…`,
        ],
        [
          `with length 20 and shorter sentence`,
          `Lorem ipsum`,
          { length: 20 },
          `Lorem ipsum`,
        ],
        [
          `length 10, endChars 5, should leave the minimum endChars`,
          `Lorem ipsum dolor sit amet`,
          { length: 10, endChars: 5 },
          `Lorem… amet`,
        ],
        [
          `length 10, startChars 3 and endChars 3, should leave the minimum endChars`,
          `Lorem ipsum dolor sit amet`,
          { length: 10, startChars: 3, endChars: 3 },
          `Lor…met`,
        ],
        [
          `only startChars is given, should truncate from the start and leftovers up to default length`,
          `Lorem ipsum dolor sit amet`,
          { startChars: 3 },
          `Lor… dolor sit amet`,
        ],

        [
          `text is shorter than either startChars or endChars`,
          `Lorem ipsum dolor sit amet`,
          { startChars: 20, endChars: 20 },
          `Lorem ipsum dolor sit amet`,
        ],
        [
          `text is shorter than startChars`,
          `Lorem ipsum`,
          { startChars: 20 },
          `Lorem ipsum`,
        ],
        [
          `text is shorter than endChars`,
          `Lorem ipsum`,
          { endChars: 20 },
          `Lorem ipsum`,
        ],
      ] as [string, string, Parameters<typeof truncateValues>[1], string][]
    ).forEach(([description, input, options, expected]) => {
      it(description, () => {
        expect(truncateValues(input, options)).toEqual(expected);
      });
    });
  });
});
