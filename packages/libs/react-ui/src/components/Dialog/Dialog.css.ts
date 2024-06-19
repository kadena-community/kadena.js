import { calc } from '@vanilla-extract/css-utils';
import { style, token } from '../../styles';
import { responsiveStyle } from '../../styles/themeUtils';
import { tokens } from '../../styles/tokens/contract.css';
import { containerClass as cardContainerClass } from '../Card/Card.css';

export const openModal = style({
  height: '100vh',
  overflowY: 'hidden',
});

export const overlayClass = style([
  cardContainerClass,
  {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
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
]);

export const closeButtonClass = style({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  background: 'none',
  border: 'none',
  padding: token('spacing.xs'),
  cursor: 'pointer',
  color: token('color.icon.base.default'),
  top: token('spacing.md'),
  right: token('spacing.md'),
});

export const titleWrapperClass = style({
  marginBlockEnd: token('spacing.md'),
  marginInlineEnd: token('spacing.xxl'),
  flexShrink: 0,
});

export const subtitleWrapperClass = style({
  marginBlockEnd: token('spacing.sm'),
  fontWeight: '300',
  color: token('color.text.gray.default'),
});

export const footerClass = style({ flexShrink: 0 });

export const contentClass = style({
  flex: 1,
  paddingInline: token('spacing.xxxl'),
  overflowY: 'auto',
  marginLeft: calc(token('spacing.xxl')).negate().toString(),
  marginRight: calc(token('spacing.xxl')).negate().toString(),
});

export const smClass = style([
  responsiveStyle({
    xs: {
      maxHeight: '100svh',
      maxWidth: '100vw',
    },
    sm: {
      maxHeight: '100svh',
      maxWidth: '100vw',
    },
    md: {
      maxWidth: tokens.kda.foundation.layout.content.maxWidth,
      maxHeight: '75vh',
    },
  }),
]);

const smallSizes = {
  xs: {
    height: '100svh',
    maxWidth: '100vw',
  },
  sm: {
    height: '100svh',
    maxWidth: '100vw',
  },
};
export const mdClass = style([
  responsiveStyle({
    ...smallSizes,
    md: {
      maxHeight: '84svh',
      maxWidth: '60vw',
    },
  }),
]);

export const lgClass = style([
  responsiveStyle({
    ...smallSizes,
    md: {
      maxHeight: '96svh',
      maxWidth: '84vw',
    },
  }),
]);
