import { sprinkles } from '../../styles';

import { style } from '@vanilla-extract/css';

export const background = style([
  sprinkles({
    position: 'fixed',
    backgroundColor: '$neutral6',
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
    width: {
      xs: '100%',
      md: '$screen75',
    },
    marginX: {
      xs: 0,
      sm: '$4',
      md: '$auto',
    },
  }),
  {
    maxWidth: '700px',
    inset: 0,
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
