import { sprinkles } from '../../styles';
import { breakpoints } from '../../styles/sprinkles.css';

import { style } from '@vanilla-extract/css';

export const background = style([
  sprinkles({
    position: 'fixed',
    backgroundColor: '$neutral4',
    padding: 0,
    cursor: 'pointer',
  }),
  {
    inset: 0,
    opacity: '.8',
  },
]);

export const wrapper = style([
  sprinkles({
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    pointerEvents: 'none',
    width: '100%',
    marginX: {
      xs: 0,
      sm: '$4',
      md: 'auto',
    },
  }),
  {
    maxWidth: '700px',
    inset: 0,
    '@media': {
      [`screen and ${breakpoints.md}`]: {
        width: '75vw',
      },
      [`screen and ${breakpoints.lg}`]: {
        width: '50vw',
      },
    },
  },
]);

export const modal = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  }),
  {
    maxHeight: '50vh',
    overflowY: 'scroll',
    pointerEvents: 'initial',
  },
]);

export const closeButton = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    fontSize: '$lg',
    fontWeight: '$light',
    border: 'none',
  }),
]);
