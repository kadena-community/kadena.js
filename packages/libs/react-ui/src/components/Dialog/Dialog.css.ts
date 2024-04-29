import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';
import { atoms } from '../../styles/atoms.css';
import { responsiveStyle } from '../../styles/themeUtils';
import { tokens } from '../../styles/tokens/contract.css';
import { containerClass as cardContainerClass } from '../Card/Card.css';

export const openModal = style([
  {
    height: '100vh',
    overflowY: 'hidden',
  },
]);

export const overlayClass = style([
  cardContainerClass,
  atoms({
    position: 'relative',
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
    sm: {
      minWidth: tokens.kda.foundation.layout.content.minWidth,
    },
    md: {
      maxWidth: tokens.kda.foundation.layout.content.maxWidth,
      maxHeight: '75vh',
    },
  }),
  {
    backdropFilter: 'blur(12px)',
    cursor: 'default',
  },
]);

export const closeButtonClass = style([
  atoms({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    padding: 'xs',
    cursor: 'pointer',
    color: 'icon.base.default',
  }),
  {
    top: tokens.kda.foundation.spacing.md,
    right: tokens.kda.foundation.spacing.md,
  },
]);

export const titleWrapperClass = style([
  atoms({
    marginBlockEnd: 'md',
    marginInlineEnd: 'xxl',
    flexShrink: 0,
  }),
]);

export const footerClass = style([atoms({ flexShrink: 0 })]);

export const contentClass = style([
  atoms({
    flex: 1,
    paddingInline: 'xxxl',
    overflowY: 'auto',
  }),
  {
    marginLeft: calc(tokens.kda.foundation.spacing.xxl).negate().toString(),
    marginRight: calc(tokens.kda.foundation.spacing.xxl).negate().toString(),
  },
]);
