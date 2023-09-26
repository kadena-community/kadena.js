import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style, styleVariants } from '@vanilla-extract/css';

const consentButton = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  }),
  {
    border: 0,
  },
]);

export const consentButtonColorVariants = styleVariants({
  positive: [
    consentButton,
    sprinkles({
      color: '$positiveContrastInverted',
    }),
    {
      ':hover': {
        color: vars.colors.$positiveHighContrast,
      },
    },
  ],
  negative: [
    consentButton,
    sprinkles({
      color: '$negativeContrastInverted',
    }),
    {
      ':hover': {
        color: vars.colors.$negativeHighContrast,
      },
    },
  ],
});
