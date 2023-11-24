import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const staticResultsListClass = style([
  sprinkles({
    padding: 0,
  }),
  {
    listStyle: 'none',
  },
]);

export const scrollBoxClass = style([
  sprinkles({
    position: 'relative',
    marginY: '$2',
    marginX: 0,
    flex: 1,
  }),
]);

export const scrollBoxEnabledClass = style([
  sprinkles({
    overflowY: 'auto',
    paddingRight: '$6',
  }),
]);

export const tabContainerClass = style([
  sprinkles({ flex: 1, overflowY: 'hidden', overflowX: 'visible' }),
]);

export const tabClass = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowY: 'hidden',
    overflowX: 'visible',
  }),
]);

export const itemLinkClass = style([
  sprinkles({
    display: 'block',
    marginBottom: '$4',
    textDecoration: 'none',
    padding: '$sm',
  }),
  {
    ':hover': {
      color: '$neutral100',
      backgroundColor: '$primaryContrastInverted',
      borderRadius: '$sm',
    },
    ':focus': {
      color: '$neutral100',
      backgroundColor: '$primaryContrastInverted',
      borderRadius: '$sm',
    },
  },
]);

export const loadingWrapperClass = style([
  sprinkles({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '$background',
  }),
  {
    opacity: '.8',
    inset: 0,
  },
]);
