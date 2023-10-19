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
    zIndex: '$modal',
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
    width: '100%',
    marginX: {
      xs: 0,
      sm: '$4',
      md: 'auto',
    },
  }),
  responsiveStyle({
    xs: {
      maxHeight: '75vh',
      maxWidth: '700px',
      inset: 0,
    },
    md: {
      width: '75vw',
    },
    lg: {
      width: '50vw',
    },
  }),
]);

export const closeButtonClass = style([
  sprinkles({
    position: 'absolute',
    top: '$8',
    right: '$md',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    fontSize: '$base',
    fontWeight: '$light',
    border: 'none',
    padding: 0,
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
