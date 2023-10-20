import { mapToProperty, responsiveStyle } from './themeUtils';

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
