import {
  darkThemeClass,
  responsiveStyle,
  sprinkles,
  vars,
} from '@kadena/react-ui/theme';

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
    {
      selectors: {
        [`${darkThemeClass} &:hover`]: {
          backgroundColor: vars.colors.$blue80,
        },
        [`&:hover`]: {
          backgroundColor: vars.colors.$blue20,
        },
      },
    },
  ],
  warning: [
    sprinkles({
      backgroundColor: {
        lightMode: '$pink10',
        darkMode: '$pink90',
      },
    }),
    {
      selectors: {
        [`${darkThemeClass} &:hover`]: {
          backgroundColor: vars.colors.$pink80,
        },
        [`&:hover`]: {
          backgroundColor: vars.colors.$pink20,
        },
      },
    },
  ],
  success: [
    sprinkles({
      backgroundColor: {
        lightMode: '$green10',
        darkMode: '$green90',
      },
    }),
    {
      selectors: {
        [`${darkThemeClass} &:hover`]: {
          backgroundColor: vars.colors.$green80,
        },
        [`&:hover`]: {
          backgroundColor: vars.colors.$green30,
        },
      },
    },
  ],
});

export const docsCardLink = style([
  sprinkles({
    textDecoration: 'none',
    fontWeight: '$bold',
    color: {
      lightMode: '$primaryContrastInverted',
      darkMode: '$primaryContrast',
    },
  }),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'none',
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

    ...responsiveStyle({
      md: {
        backgroundPosition: 'right -250px bottom -250px',
        backgroundSize: '500px',
      },
    }),
  },
  contribute: {
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url("/assets/background/contribute.svg")`,
    backgroundPosition: 'right -165px bottom -120px',
    backgroundSize: '300px',

    ...responsiveStyle({
      md: {
        backgroundPosition: 'right -300px bottom -200px',
        backgroundSize: '500px',
      },
    }),
  },
  quickstart: {
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url("/assets/background/quickstart.svg")`,
    backgroundPosition: 'right -140px bottom -120px',
    backgroundSize: '300px',

    ...responsiveStyle({
      md: {
        backgroundPosition: 'right -220px bottom -220px',
        backgroundSize: '500px',
      },
    }),
  },
  smartwallet: {
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url("/assets/background/smartwallet.svg")`,
    backgroundPosition: 'right -140px bottom -120px',
    backgroundSize: '300px',

    ...responsiveStyle({
      md: {
        backgroundPosition: 'right -320px bottom -120px',
        backgroundSize: '500px',
      },
    }),
  },
  react: {
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url("/assets/background/react.svg")`,
    backgroundPosition: 'right -140px bottom -120px',
    backgroundSize: '300px',

    ...responsiveStyle({
      md: {
        backgroundPosition: 'right -250px bottom -220px',
        backgroundSize: '450px',
      },
    }),
  },
  marmalade: {
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url("/assets/background/marmalade.svg")`,
    backgroundPosition: 'right -140px bottom -120px',
    backgroundSize: '300px',

    ...responsiveStyle({
      md: {
        backgroundPosition: 'right -200px bottom -220px',
        backgroundSize: '450px',
      },
    }),
  },
  default: {},
});
