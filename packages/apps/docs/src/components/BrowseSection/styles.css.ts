import { breakpoints, sprinkles, vars } from '@kadena/react-ui/theme';

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

      '@media': {
        [`screen and ${breakpoints.md}`]: {
          flexDirection: 'row',
        },
      },
    },
  ],
  column: [
    sprinkles({
      paddingY: 0,
      paddingX: '$5',
    }),
    {
      listStyle: 'disc',
    },
  ],
});

export const columnLinkListItemClass = style([
  sprinkles({
    color: '$primaryContrast',
    lineHeight: '$lg',
  }),
]);

export const columnLinkClass = style([
  sprinkles({
    color: '$primaryContrast',
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
    paddingRight: '$4',
    paddingY: '$3',
  }),
  {
    flexBasis: '50%',
    '@media': {
      [`screen and ${breakpoints.md}`]: {
        flexBasis: '33%',
      },
    },
  },
]);

export const listItemLinkClass = style([
  sprinkles({
    display: 'flex',
    textDecoration: 'none',
    color: '$primaryContrast',
  }),
  {
    ':hover': {
      textDecoration: 'underline',
    },
  },
]);
