import { ColorType, sprinkles, vars } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 'lg',
    cursor: 'pointer',
    size: 11,
    border: 'none',
  }),
  {
    backgroundColor: 'transparent',
    color: vars.colors.neutral5,
    transition: 'opacity .2s ease',
    selectors: {
      '&:hover': {
        opacity: '.6',
      },
      '&:focus-visible': {
        outlineOffset: '2px',
        outline: `2px solid ${vars.colors.neutral5}`,
      },
    },
  },
]);

export const colorVariants = styleVariants(
  {
    default: 'default',
    inverted: 'inverted',
    primary: 'primary',
    secondary: 'secondary',
    positive: 'positive',
    warning: 'warning',
    negative: 'negative',
  },
  (color) => {
    return [
      container,
      {
        backgroundColor:
          color === 'inverted' || color === 'default'
            ? 'transparent'
            : vars.colors[`${color as ColorType}Surface`],
        color:
          color === 'inverted'
            ? vars.colors.neutral3
            : vars.colors[`${color as ColorType}HighContrast`],
      },
    ];
  },
);
