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
    paddingX: 0,
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

export const itemStackClass = style([
  {
    gap: '0 !important',
  },
]);

export const listItemLinkClass = style([
  sprinkles({
    display: 'flex',
    textDecoration: 'none',
  }),
  {
    ':hover': {
      textDecoration: 'underline',
    },
  },
]);

export const iconClass = style([
  sprinkles({
    marginRight: '$2',
  }),
]);
