import {
  darkThemeClass,
  responsiveStyle,
  sprinkles,
  vars,
} from '@kadena/react-ui/theme';
import { style, styleVariants } from '@vanilla-extract/css';

export const sectionRowContainerClass = style([
  sprinkles({
    width: '100%',
  }),
]);

export const directionVariants = styleVariants({
  row: [
    sprinkles({
      display: 'flex',
      flexWrap: 'wrap',
      padding: 0,
      width: '100%',
    }),
    {
      listStyle: 'none',
      rowGap: 0,
      flexDirection: 'column',

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
      paddingInline: vars.sizes.$5,
      listStyle: 'disc',
    },
  ],
});

export const columnLinkListItemClass = style([
  sprinkles({
    color: '$primaryContrastInverted',
  }),
  {
    paddingBlock: vars.sizes.$1,
  },
]);

export const columnLinkClass = style([
  sprinkles({
    color: '$primaryContrastInverted',
    textDecoration: 'underline',
  }),
  {
    ':hover': {
      color: vars.colors.$primaryHighContrast,
      textDecoration: 'none',
    },
  },
]);

export const listItemClass = style([
  sprinkles({
    display: 'flex',
    gap: '$4',
  }),
  {
    flexBasis: '50%',
    paddingInlineEnd: vars.sizes.$4,
    paddingBlock: vars.sizes.$3,
    ...responsiveStyle({
      md: {
        flexBasis: '33%',
      },
    }),
  },
]);

export const listItemLinkClass = style([
  sprinkles({
    display: 'flex',
    textDecoration: 'none',
    color: '$primaryContrastInverted',
  }),
  {
    ':hover': {
      textDecoration: 'none',
    },
  },
]);

export const listItemLinkTextClass = style({
  color: vars.colors.$gray60,
  selectors: {
    [`${darkThemeClass} &`]: {
      color: vars.colors.$gray40,
    },
  },
});

export const markerVariants = styleVariants({
  none: {
    listStyle: 'none',
    padding: 0,
  },
  default: {},
});
