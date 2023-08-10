import { sprinkles } from '@theme/sprinkles.css';
import { ColorType, vars } from '@theme/vars.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const linkContainerClass = style([
  sprinkles({
    display: 'flex',
    gap: '$2',
  }),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'none',
      },
      '&:active': {
        color: vars.colors.$negativeContrast,
      },
      '&:visited': {
        color: vars.colors.$tertiaryContrast,
      },
    },
  },
]);
