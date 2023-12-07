import { describe, expect, test } from 'vitest';
import { flattenTokens, mapToProperty, responsiveStyle } from './themeUtils';

describe('responsiveStyle function', () => {
  test('creates style properties correctly', () => {
    const styleInput = {
      xs: { color: 'red' },
      sm: { color: 'purple' },
      md: { color: 'blue' },
      lg: { fontSize: '20px' },
    };

    const styleOutput = {
      color: 'red',
      '@media': {
        'screen and (min-width: 40rem)': {
          color: 'purple',
        },
        'screen and (min-width: 48rem)': {
          color: 'blue',
        },
        'screen and (min-width: 64rem)': {
          fontSize: '20px',
        },
      },
    };

    expect(responsiveStyle(styleInput)).toEqual(styleOutput);
  });
});

describe('mapToProperty function', () => {
  test('creates style properties correctly', () => {
    expect(mapToProperty('gridRow')('span 1')).toEqual({ gridRow: 'span 1' });
    expect(mapToProperty('gridRow', 'md')('span 2')).toEqual({
      '@media': {
        'screen and (min-width: 48rem)': {
          gridRow: 'span 2',
        },
      },
    });
  });
});

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
