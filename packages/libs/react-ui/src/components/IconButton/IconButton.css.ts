import { ColorType, sprinkles, vars } from '../../styles';

import {
  createVar,
  fallbackVar,
  globalStyle,
  style,
  styleVariants,
} from '@vanilla-extract/css';

const surfaceColor = createVar(),
  highContrastColor = createVar();

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
    backgroundColor: fallbackVar(surfaceColor, 'transparent'),
    color: fallbackVar(highContrastColor, vars.colors.neutral5),
    transition: 'opacity .2s ease',
    selectors: {
      '&:hover': {
        opacity: '.6',
      },
      '&:focus-visible': {
        outlineOffset: '2px',
        outline: `2px solid ${highContrastColor}`,
      },
    },
  },
]);

globalStyle(`${container} > span > svg`, {
  color: fallbackVar(highContrastColor, vars.colors.neutral5),
});

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
        vars: {
          [surfaceColor]: vars.colors[`${color as ColorType}Surface`],
          [highContrastColor]:
            color === 'inverted'
              ? vars.colors.neutral3
              : vars.colors[`${color as ColorType}HighContrast`],
        },
      },
    ];
  },
);
