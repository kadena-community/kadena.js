import { sprinkles } from '@theme/sprinkles.css';
import { responsiveStyle } from '@theme/themeUtils';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const openModal = style([
  {
    height: '100vh',
    overflowY: 'hidden',
  },
]);

export const underlayClass = style([
  sprinkles({
    position: 'fixed',
    cursor: 'pointer',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    selectors: {
      '&::before': {
        content: '',
        position: 'absolute',
        inset: 0,
        backgroundColor: vars.colors.$neutral5,
        opacity: 0.5,
      },
    },
  },
]);

export const overlayClass = style([
  sprinkles({
    position: 'relative',
    pointerEvents: 'initial',
    overflow: 'auto',
    width: '100%',
  }),
  responsiveStyle({
    xs: {
      maxHeight: '100svh',
      maxWidth: '100vw',
      inset: 0,
    },
    md: {
      maxWidth: vars.sizes.$maxContent,
      maxHeight: '75vh',
    },
  }),
]);

export const closeButtonClass = style([
  sprinkles({
    position: 'absolute',
    top: '$md',
    right: '$md',
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    padding: '$sm',
    cursor: 'pointer',
    color: 'inherit',
  }),
]);

export const titleWrapperClass = style([
  sprinkles({
    marginBottom: '$4',
    marginRight: '$20',
  }),
]);
