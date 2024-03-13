import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/styles';
import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

export const headingWrapperClass = style({
  marginInlineStart: tokens.kda.foundation.size.n12,
});

export const blogitem = style([
  atoms({
    backgroundColor: 'transparent',
  }),
  {
    paddingBlock: tokens.kda.foundation.spacing.xxxl,
    paddingInline: tokens.kda.foundation.spacing.xxxl,
    marginBlockStart: `${tokens.kda.foundation.size.n8}!important`,
    marginBlockEnd: `${tokens.kda.foundation.size.n8}!important`,
    willChange: 'background-color',
    transition: 'background-color .2s ease',

    selectors: {
      '&:hover': {
        backgroundColor: tokens.kda.foundation.color.background.layer20.default,
      },
    },
  },
]);

export const link = style([
  atoms({
    display: 'block',
    color: 'text.subtle.default',
    textDecoration: 'none',
  }),
  {
    selectors: {
      '&:hover': {
        color: tokens.kda.foundation.color.text.subtlest['@hover'],
      },
    },
  },
]);

export const footer = style([
  atoms({
    color: 'text.subtlest.inverse.default',
  }),
  {
    marginBlockStart: tokens.kda.foundation.size.n3,
  },
]);

export const footerVariant = styleVariants({
  default: { fontSize: 'smaller' },
  large: { fontSize: 'inherit' },
});

export const metaItem = style([
  {
    selectors: {
      '&:not(:last-child)::after': {
        content: '"•"',
        margin: `0 ${tokens.kda.foundation.size.n6}`,
      },
    },
  },
]);

export const figureClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 'no',

    position: 'relative',
    backgroundColor: 'base.default',
    borderRadius: 'md',
  }),
  {
    width: `100%`,

    ...responsiveStyle({
      md: {
        width: `clamp(${tokens.kda.foundation.size.n32}, 15vw, ${tokens.kda.foundation.size.n48})`,
        aspectRatio: '1',
      },
    }),
  },
]);

export const figureVariant = styleVariants({
  default: {
    width: '100%',
    aspectRatio: '16 / 3',
    ...responsiveStyle({
      md: {
        width: `clamp(${tokens.kda.foundation.size.n32}, 15vw, ${tokens.kda.foundation.size.n48})`,
      },
    }),
  },
  large: {
    width: '100%',
    aspectRatio: '16 / 7',
    ...responsiveStyle({
      md: {
        width: `clamp(${tokens.kda.foundation.size.n48}, 20vw, ${tokens.kda.foundation.size.n64})`,
      },
    }),
  },
});

export const imageClass = style([
  atoms({
    borderRadius: 'md',
  }),
]);

export const authorTitleClass = style([
  atoms({
    fontSize: 'md',
    fontWeight: 'secondaryFont.regular',
    color: 'text.subtlest.inverse.default',
  }),
]);

export const gridWrapperClass = style([
  atoms({
    display: 'grid',
  }),
  {
    gridTemplateAreas: `
      "image"
      "header"
    `,

    ...responsiveStyle({
      md: {
        gridTemplateAreas: `
        "header image"
      `,
      },
    }),
  },
]);

export const gridBlogItemImage = style([
  atoms({
    marginInlineStart: { xs: 'no', md: 'xxl' },
    marginBlockEnd: { xs: 'xxl', md: 'no' },
  }),
]);

export const gridBlogItemContent = styleVariants({
  default: {
    marginBlockStart: tokens.kda.foundation.spacing.sm,
    marginBlockEnd: tokens.kda.foundation.spacing.md,
  },
  large: {},
});

export const footerTags = style({
  display: 'block',
  marginBlockStart: tokens.kda.foundation.size.n3,
});

globalStyle(
  `${gridBlogItemContent.default}  h4, ${gridBlogItemContent.default}  h4 span`,
  {
    fontSize: tokens.kda.foundation.typography.fontSize.base,
  },
);
