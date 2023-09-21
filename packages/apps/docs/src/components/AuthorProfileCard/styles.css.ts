import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const sectionClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    flex: 2,
  },
]);
export const sectionExtraClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    flex: 3,
  },
]);

export const linkClass = style([
  sprinkles({
    color: '$foreground',
    textDecoration: 'none',
  }),
  {
    selectors: {
      '&:hover': {
        color: vars.colors.$primaryContrastInverted,
        textDecoration: 'underline',
      },
    },
  },
]);

export const descriptionClass = style([
  sprinkles({
    color: '$neutral3',
  }),
]);
