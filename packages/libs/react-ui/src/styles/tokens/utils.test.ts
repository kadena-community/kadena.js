import { describe, expect, test } from 'vitest';
import { flattenTokens } from './utils';

describe('flattenTokens function', () => {
  test('creates a flattened object with concatenated token names', () => {
    const border = {
      width: {
        hairline: '1px',
        normal: '2px',
        thick: '4px',
        other: {
          test: '5px',
        },
      },
      hairline: '1px solid black',
      normal: '2px solid black',
      thick: '3px solid black',
      '@hover': '1px solid black',
    };

    const flattenedBorder = {
      'width.hairline': '1px',
      'width.normal': '2px',
      'width.thick': '4px',
      'width.other.test': '5px',
      hairline: '1px solid black',
      normal: '2px solid black',
      thick: '3px solid black',
    };

    expect(flattenTokens(border)).toEqual(flattenedBorder);
  });
});
