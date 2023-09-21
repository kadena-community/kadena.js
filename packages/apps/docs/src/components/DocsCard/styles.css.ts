import { breakpoints, sprinkles, vars } from '@kadena/react-ui/theme';

import { style, styleVariants } from '@vanilla-extract/css';

export const cardClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    borderRadius: '$md',
    paddingX: '$10',
    paddingY: '$6',
  }),
  {
    transition: 'all .3s ease',
  },
]);

export const cardVariants = styleVariants({
  info: [
    sprinkles({
      backgroundColor: {
        lightMode: '$blue10',
        darkMode: '$blue90',
      },
    }),
  ],
  warning: [
    sprinkles({
      backgroundColor: {
        lightMode: '$pink10',
        darkMode: '$pink90',
      },
    }),
  ],
  success: [
    sprinkles({
      backgroundColor: {
        lightMode: '$green10',
        darkMode: '$green90',
      },
    }),
  ],
});

export const docsCardLink = style([
  sprinkles({
    textDecoration: 'none',
    fontWeight: '$bold',
    color: {
      lightMode: '$purple100',
      darkMode: '$purple20',
    },
  }),
  {
    color: vars.colors.$purple100,
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
]);

export const backgroundVariant = styleVariants({
  whitepapers: {
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url("/assets/background/whitepapers.svg")`,
    backgroundPosition: 'right -150px bottom -150px',
    backgroundSize: '300px',

    '@media': {
      [`screen and ${breakpoints.md}`]: {
        backgroundPosition: 'right -200px bottom -250px',
        backgroundSize: '500px',
      },
    },
  },
  contribute: {
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url("/assets/background/contribute.svg")`,
    backgroundPosition: 'right -165px bottom -120px',
    backgroundSize: '300px',

    '@media': {
      [`screen and ${breakpoints.md}`]: {
        backgroundPosition: 'right -300px bottom -200px',
        backgroundSize: '500px',
      },
    },
  },
  quickstart: {
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url("/assets/background/quickstart.svg")`,
    backgroundPosition: 'right -140px bottom -120px',
    backgroundSize: '300px',

    '@media': {
      [`screen and ${breakpoints.md}`]: {
        backgroundPosition: 'right -220px bottom -220px',
        backgroundSize: '500px',
      },
    },
  },
  default: {},
});
