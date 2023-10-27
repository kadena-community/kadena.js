import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

export const blogitem = style([
  sprinkles({
    paddingY: '$10',
    paddingX: '$10',
    backgroundColor: 'transparent',
  }),
  {
    marginTop: `${vars.sizes.$8}!important`,
    marginBottom: `${vars.sizes.$8}!important`,
    willChange: 'background-color',
    transition: 'background-color .2s ease',

    selectors: {
      '&:hover': {
        backgroundColor: vars.colors.$neutral2,
      },
    },
  },
]);

export const link = style([
  sprinkles({
    display: 'block',
    color: '$foreground',
    textDecoration: 'none',
  }),
  {
    selectors: {
      '&:hover': {
        color: vars.colors.$neutral4,
      },
    },
  },
]);

export const footer = style([
  sprinkles({
    marginTop: '$3',
    color: '$neutral3',
  }),
]);

export const footerVariant = styleVariants({
  default: { fontSize: 'smaller' },
  large: { fontSize: 'inherit' },
});

export const metaItem = style([
  sprinkles({}),
  {
    selectors: {
      '&:not(:last-child)::after': {
        content: '"•"',
        margin: `0 ${vars.sizes.$6}`,
      },
    },
  },
]);

export const tagLinkClass = style([
  sprinkles({
    marginRight: '$2',
  }),
]);

export const figureClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 0,

    position: 'relative',
    backgroundColor: '$neutral2',
    borderRadius: '$md',
  }),
  {
    width: `100%`,

    ...responsiveStyle({
      md: {
        width: `clamp(${vars.sizes.$32}, 15vw, ${vars.sizes.$48})`,
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
        width: `clamp(${vars.sizes.$32}, 15vw, ${vars.sizes.$48})`,
      },
    }),
  },
  large: {
    width: '100%',
    aspectRatio: '16 / 7',
    ...responsiveStyle({
      md: {
        width: `clamp(${vars.sizes.$48}, 20vw, ${vars.sizes.$64})`,
      },
    }),
  },
});

export const imageClass = style([
  sprinkles({
    borderRadius: '$md',
  }),
]);

export const authorTitleClass = style([
  sprinkles({
    fontSize: '$md',
    fontWeight: '$normal',
    color: '$neutral3',
  }),
]);

export const gridWrapperClass = style([
  sprinkles({
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

export const gridBlogItemImage = style({});
export const gridBlogItemContent = styleVariants({
  default: {
    marginTop: vars.sizes.$2,
    marginBottom: vars.sizes.$4,
  },
  large: {},
});

export const footerTags = style({
  display: 'block',
  marginTop: vars.sizes.$3,
});

globalStyle(
  `${gridBlogItemContent.default}  h4, ${gridBlogItemContent.default}  h4 span`,
  {
    fontSize: vars.sizes.$md,
  },
);
