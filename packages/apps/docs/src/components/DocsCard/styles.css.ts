import { getClassName } from '@/utils/getClassName';
import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/styles';
import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

export const descriptionWrapperClass = style([
  {
    ...responsiveStyle({
      sm: {
        marginInlineEnd: tokens.kda.foundation.size.n20,
      },
      md: {
        marginInlineEnd: tokens.kda.foundation.spacing.md,
      },
      lg: {
        marginInlineEnd: tokens.kda.foundation.size.n20,
      },
    }),
  },
]);

export const cardClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    borderRadius: 'md',
    paddingInline: 'xxxl',
    paddingBlock: 'lg',
  }),
  {
    transition: 'all .3s ease',
  },
]);

export const cardVariants = styleVariants({
  info: [
    {
      backgroundColor: tokens.kda.foundation.color.semantic.info.n10,
      selectors: {
        [`&:hover`]: {
          backgroundColor: tokens.kda.foundation.color.semantic.info.n20,
        },
      },
    },
  ],
  warning: [
    {
      backgroundColor: tokens.kda.foundation.color.semantic.warning.n10,
      selectors: {
        [`&:hover`]: {
          backgroundColor: tokens.kda.foundation.color.semantic.warning.n20,
        },
      },
    },
  ],
  success: [
    {
      backgroundColor: tokens.kda.foundation.color.semantic.positive.n10,
      selectors: {
        [`&:hover`]: {
          backgroundColor: tokens.kda.foundation.color.semantic.positive.n20,
        },
      },
    },
  ],
});

export const docsCardLink = style([
  atoms({
    textDecoration: 'none',
    fontWeight: 'secondaryFont.bold',
    color: 'text.brand.primary.default',
  }),
  {
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

// DOC CARDS
globalStyle(
  `${getClassName(cardVariants.info)} ${getClassName(docsCardLink)}`,
  {
    color: tokens.kda.foundation.color.semantic.info.n90,
  },
);
globalStyle(
  `${getClassName(cardVariants.info)} ${getClassName(docsCardLink)}:hover`,
  {
    color: tokens.kda.foundation.color.semantic.info.n100,
  },
);

globalStyle(
  `${getClassName(cardVariants.warning)} ${getClassName(docsCardLink)}`,
  {
    color: tokens.kda.foundation.color.semantic.warning.n90,
  },
);
globalStyle(
  `${getClassName(cardVariants.warning)} ${getClassName(docsCardLink)}:hover`,
  {
    color: tokens.kda.foundation.color.semantic.warning.n100,
  },
);

globalStyle(
  `${getClassName(cardVariants.success)} ${getClassName(docsCardLink)}`,
  {
    color: tokens.kda.foundation.color.semantic.positive.n90,
  },
);
globalStyle(
  `${getClassName(cardVariants.success)} ${getClassName(docsCardLink)}:hover`,
  {
    color: tokens.kda.foundation.color.semantic.positive.n100,
  },
);
