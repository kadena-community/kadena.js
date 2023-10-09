import { style } from '@vanilla-extract/css';

export const container = style([
  {
    width: '100%',
  },
]);
export const header = style([
  {
    display: 'flex',
    justifyContent: 'space-between',
  },
]);
export const tabsClass = style([
  {
    display: 'flex',
    gap: '1rem',
  },
]);

export const tabClass = style([
  {
    background: '#2d2635',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
  },
]);

export const closeClass = style([
  {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
  },
]);

export const body = style([
  {
    width: '100%',
    display: 'flex',
  },
]);

export const bodyLeft = style([
  {
    background: '#372A46',
    height: '100%',
    flexBasis: '60%',
    display: 'flex',
  },
]);

export const bodyRight = style([
  {
    background: '#060508',
    padding: '1rem',
    flexBasis: '40%',
  },
]);

export const footer = style([
  {
    width: '100%',
    paddingRight: '40%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
]);
export const footerButton = style([
  {
    background: '#2d2635',
    width: '42px',
    height: '42px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '0.5rem',
  },
]);
