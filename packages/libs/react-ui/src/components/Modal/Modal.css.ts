import { vars } from '../../styles';
import { breakpoints } from '../../styles/sprinkles.css';

import { style } from '@vanilla-extract/css';

export const background = style({
  position: 'fixed',
  backgroundColor: vars.colors.$neutral6,
  opacity: '.8',
  inset: 0,
  padding: 0,
  cursor: 'pointer',
});

export const wrapper = style({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
  pointerEvents: 'none',

  '@media': {
    [`screen and ${breakpoints.sm}`]: {
      margin: `0 ${vars.sizes.$4}`,
    },
    [`screen and ${breakpoints.md}`]: {
      margin: `0 auto`,
      width: '75vw',
    },
    [`screen and ${breakpoints.lg}`]: {
      margin: `0 auto`,
      width: '50vw',
      maxWidth: '700px',
    },
  },
});

export const modal = style({
  display: 'flex',
  flexDirection: 'column',
  pointerEvents: 'initial',
  width: '100%',
});
