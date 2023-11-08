import { sprinkles } from '@theme/sprinkles.css';
import { responsiveStyle } from '@theme/themeUtils';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';
import { containerClass as cardContainerClass } from '../Card/Card.css';

export const openModal = style([
  {
    height: '100vh',
    overflowY: 'hidden',
  },
]);

export const overlayClass = style([
  cardContainerClass,
  sprinkles({
    position: 'relative',
    pointerEvents: 'initial',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  }),
  responsiveStyle({
    xs: {
      paddingLeft: 0,
      paddingRight: 0,
      maxHeight: '100svh',
      maxWidth: '100vw',
      inset: 0,
    },
    md: {
      maxWidth: vars.contentWidth.$maxContentWidth,
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
    flexShrink: 0,
    paddingX: '$10',
  }),
]);

export const footerClass = style([
  sprinkles({ flexShrink: 0, paddingX: '$10' }),
]);

export const contentClass = style([
  sprinkles({
    paddingX: '$10',
    overflow: 'auto',
    flex: 1,
  }),
]);
