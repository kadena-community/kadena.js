import { atoms, responsiveStyle, tokens } from '@kadena/kode-ui/styles';
import { style, styleVariants } from '@vanilla-extract/css';

export const sectionRowContainerClass = style([
  atoms({
    width: '100%',
  }),
]);

export const directionVariants = styleVariants({
  row: [
    atoms({
      display: 'flex',
      flexWrap: 'wrap',
      padding: 'no',
      width: '100%',
      flexDirection: 'column',
    }),
    {
      listStyle: 'none',
      rowGap: 0,

      ...responsiveStyle({
        md: {
          flexDirection: 'row',
        },
      }),
    },
  ],
  column: [
    {
      paddingBlock: 0,
      paddingInline: tokens.kda.foundation.size.n5,
      listStyle: 'disc',
    },
  ],
});

export const columnLinkListItemClass = style([
  atoms({
    paddingBlock: 'xs',
    color: 'text.brand.primary.default',
  }),
]);

export const columnLinkClass = style([
  atoms({
    color: 'text.brand.primary.default',
    textDecoration: 'underline',
  }),
  {
    ':hover': {
      color: tokens.kda.foundation.color.text.brand.primary['@hover'],
      textDecoration: 'none',
    },
  },
]);

export const listItemClass = style([
  atoms({
    display: 'flex',
    gap: 'md',
    paddingInlineEnd: 'md',
    paddingBlock: 'md',
  }),
  {
    flexBasis: '50%',
    ...responsiveStyle({
      md: {
        flexBasis: '33%',
      },
    }),
  },
]);

export const listItemLinkClass = style([
  atoms({
    display: 'flex',
    textDecoration: 'none',
    color: 'text.brand.primary.default',
  }),
  {
    ':hover': {
      textDecoration: 'none',
    },
  },
]);

export const listItemLinkTextClass = style({
  color: tokens.kda.foundation.color.neutral.n60,
});

export const markerVariants = styleVariants({
  none: {
    listStyle: 'none',
    padding: 0,
  },
  default: {},
});
