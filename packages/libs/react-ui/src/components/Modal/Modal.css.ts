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
    inset: 0,
    backgroundColor: '$neutral5',
  }),
  {
    opacity: 0.5,
  },
]);

export const overlayClass = style([
  sprinkles({
    position: 'relative',
    pointerEvents: 'initial',
    overflow: 'auto',
    width: '100%',
    marginX: {
      xs: 0,
      sm: '$4',
      md: 'auto',
    },
  }),
  responsiveStyle({
    xs: {
      position: 'fixed',
      top: '50%',
      left: '50%',
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
