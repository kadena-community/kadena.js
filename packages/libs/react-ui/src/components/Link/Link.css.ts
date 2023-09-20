import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const linkContainerClass = style([
  sprinkles({
    display: 'flex',
    gap: '$2',
    color: '$primaryContrastInverted',
  }),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'none',
      },
      '&:active': {
        color: vars.colors.$negativeContrastInverted,
      },
      '&:visited': {
        color: vars.colors.$tertiaryContrastInverted,
      },
    },
  },
]);
