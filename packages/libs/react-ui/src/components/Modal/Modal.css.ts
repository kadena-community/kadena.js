import { sprinkles } from '@theme/sprinkles.css';
import { responsiveStyle } from '@theme/themeUtils';
import { style } from '@vanilla-extract/css';

export const openModal = style([
  {
    height: '100vh',
    overflowY: 'hidden',
  },
]);

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
  responsiveStyle({
    xs: {
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

export const modal = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  }),
  {
    maxHeight: '75vh',
    pointerEvents: 'initial',
  },
]);

export const closeButton = style([
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
  }),
  {
    alignSelf: 'end',
  },
]);

export const titleWrapper = style([
  sprinkles({
    height: '$12',
    marginBottom: '$4',
  }),
  {
    width: 'calc(100% - 100px)',
  },
]);
