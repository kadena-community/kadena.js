import { describe, expect, it } from 'vitest';
import { defaults } from './layers.css';
import { layerStyles, mapStyleVariants, traverseRecipe } from './utils';

describe('style', () => {
  it('should update single flat object', () => {
    const styles = layerStyles({ padding: '1px' });

    const expected = {
      '@layer': {
        [defaults]: {
          padding: '1px',
        },
      },
    };

    expect(styles).toEqual(expected);
  });

  it('should update arrays with single object structure', () => {
    const styles = layerStyles([{ padding: '1px' }]);

    const expected = [
      {
        '@layer': {
          [defaults]: {
            padding: '1px',
          },
        },
      },
    ];

    expect(styles).toEqual(expected);
  });

  it('should update arrays with multiple objects structure', () => {
    const styles = layerStyles([{ padding: '1px' }, { margin: '2px' }]);

    const expected = [
      {
        '@layer': {
          [defaults]: {
            padding: '1px',
          },
        },
      },
      {
        '@layer': {
          [defaults]: {
            margin: '2px',
          },
        },
      },
    ];

    expect(styles).toEqual(expected);
  });

  it('should update arrays with multiple types structure', () => {
    const styles = layerStyles([{ padding: '1px' }, 'someClassname']);

    const expected = [
      {
        '@layer': {
          [defaults]: {
            padding: '1px',
          },
        },
      },
      'someClassname',
    ];

    expect(styles).toEqual(expected);
  });
});

describe('recipe', () => {
  it('Should update base styles', () => {
    const styles = traverseRecipe({ base: { padding: '1px' } });

    const expected = {
      base: {
        '@layer': {
          [defaults]: {
            padding: '1px',
          },
        },
      },
    };

    expect(styles).toEqual(expected);
  });

  it('Should update variant styles', () => {
    const styles = traverseRecipe({
      variants: {
        size: {
          small: {
            padding: '1px',
          },
          medium: {
            padding: '2px',
          },
          large: [
            'someclassname',
            {
              padding: '2px',
            },
          ],
        },
      },
    });

    const expected = {
      variants: {
        size: {
          small: {
            '@layer': {
              [defaults]: {
                padding: '1px',
              },
            },
          },
          medium: {
            '@layer': {
              [defaults]: {
                padding: '2px',
              },
            },
          },
          large: [
            'someclassname',
            {
              '@layer': {
                [defaults]: {
                  padding: '2px',
                },
              },
            },
          ],
        },
      },
    };

    expect(styles).toEqual(expected);
  });

  it('Should update compoundVariant styles', () => {
    const styles = traverseRecipe({
      compoundVariants: [
        {
          variants: {
            color: 'neutral',
            size: 'large',
          },
          style: {
            padding: '1px',
          },
        },
      ],
    });

    const expected = {
      compoundVariants: [
        {
          variants: {
            color: 'neutral',
            size: 'large',
          },
          style: {
            '@layer': {
              [defaults]: {
                padding: '1px',
              },
            },
          },
        },
      ],
    };

    expect(styles).toEqual(expected);
  });
});

describe('styleVariants', () => {
  it('Should update base styles', () => {
    const styles = mapStyleVariants({ awesomeVariant: { padding: '1px' } });

    const expected = {
      awesomeVariant: {
        '@layer': {
          [defaults]: {
            padding: '1px',
          },
        },
      },
    };

    expect(styles).toEqual(expected);
  });
});

describe('globalStyle', () => {
  it('Should update global styles', () => {
    const styles = layerStyles({ backgroundColor: 'red' });

    const expected = {
      '@layer': {
        [defaults]: {
          backgroundColor: 'red',
        },
      },
    };

    expect(styles).toEqual(expected);
  });
});
