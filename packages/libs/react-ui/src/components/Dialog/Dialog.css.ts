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
    top: '$xs',
    right: '$xs',
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    padding: '$xs',
    cursor: 'pointer',
    color: 'inherit',
  }),
]);

export const titleWrapperClass = style([
  sprinkles({
    marginBottom: '$4',
    marginRight: '$20',
    flexShrink: 0,
  }),
]);

export const footerClass = style([sprinkles({ flexShrink: 0 })]);

export const contentClass = style([
  sprinkles({
    flex: 1,
    paddingX: '$10',
    overflowY: 'auto',
  }),
  {
    marginLeft: `-2.5rem`,
    marginRight: `-2.5rem`,
  },
]);
