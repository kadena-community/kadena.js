import { breakpoints, sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const sectionRowContainer = style([
  sprinkles({
    width: '100%',
  }),
]);

export const columnLinkList = style([
  sprinkles({
    paddingY: 0,
    paddingX: '$5',
  }),
  {
    listStyle: 'disc',
  },
]);

export const columnLinkListItem = style([
  sprinkles({
    color: '$primaryContrast',
    lineHeight: '$lg',
  }),
]);

export const columnLink = style([
  sprinkles({
    color: '$primaryContrast',
    textDecoration: 'none',
  }),
  {
    ':hover': {
      color: vars.colors.$primaryHighContrast,
      textDecoration: 'underline',
    },
  },
]);

export const rowLinkList = style([
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
]);

export const listItem = style([
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

export const itemStack = style([
  {
    gap: '0 !important',
  },
]);

export const listItemLink = style([
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

export const iconStyle = style([
  sprinkles({
    marginRight: '$2',
  }),
]);
