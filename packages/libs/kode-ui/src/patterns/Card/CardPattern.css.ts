import { style } from '@vanilla-extract/css';
import { atoms, recipe, responsiveStyle, token } from '../../../src/styles';

// NOTE: Padding is applied via this container instead of margin to the container to avoid margin collapse with the body
export const paddingContainer = style({
  ...responsiveStyle({
    md: {
      paddingBlock: token('size.n32'),
    },
  }),
  selectors: {
    '&:not(:last-child)': {
      paddingBottom: 0,
    },
  },
});

export const container = style([
  atoms({
    border: 'none',
    borderRadius: 'no',
  }),
  {
    ...responsiveStyle({
      md: {
        borderRadius: token('radius.md'),
        border: token('border.hairline'),
        width: '42rem',
        marginInlineStart: '50%',
        transform: 'translateX(-50%)',
      },
    }),
  },
]);

export const extendedContainer = style([
  {
    ...responsiveStyle({
      md: {
        marginBlockStart: '-50%',
      },
    }),
  },
]);

export const bodyContainer = style([
  {
    flex: 1,
    width: '100%',
    selectors: {
      '& + &': {
        marginBlockStart: token('size.n16'),
      },
    },
  },
]);

export const heading = recipe({
  base: [
    {
      marginBlockEnd: token('spacing.md'),
      selectors: {
        [`${bodyContainer}:first-child &`]: {
          lineHeight: token('typography.lineHeight.2xl'),
        },
        [`${bodyContainer}:not(:first-child) &`]: {
          lineHeight: token('typography.lineHeight.xl'),
        },
      },
    },
  ],

  variants: {
    level: {
      level1: {
        fontSize: `${token('typography.fontSize.2xl')} !important`,
      },
      level2: {
        fontSize: `${token('typography.fontSize.lg')} !important`,
      },
    },
  },
});

export const bodyContent = style([
  { marginBlockStart: token('spacing.xl'), flex: 1.5 },
  {
    ...responsiveStyle({
      md: {
        marginBlockStart: token('size.n25'),
      },
    }),
    selectors: {
      "&[data-layout='no-visual']": responsiveStyle({
        md: {
          marginBlockStart: token('size.n10'),
        },
      }),
    },
  },
]);

export const footerGroup = style([
  {
    width: '100%',
    selectors: {
      '& > &': {
        marginBlockStart: 0,
      },
    },
  },
]);
