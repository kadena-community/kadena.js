import {
  atoms,
  darkThemeClass,
  responsiveStyle,
  tokens,
} from '@kadena/react-ui/theme';
import { style, styleVariants } from '@vanilla-extract/css';
import { $$modalZIndex, $$navMenu, $$pageWidth } from '../../global.css';

export const logoClass = style({
  zIndex: $$navMenu,
  maxWidth: tokens.kda.foundation.size.n48,
  paddingRight: tokens.kda.foundation.spacing.xxxl,
});

export const headerButtonClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBlock: 'sm',
    borderRadius: 'lg',
    cursor: 'pointer',
    color: 'text.base.inverse.default',
  }),
  {
    width: tokens.kda.foundation.size.n11,
    border: 0,
    transition: `opacity 0.2s ease`,
    selectors: {
      [`${darkThemeClass} &`]: {
        color: tokens.kda.foundation.color.text.base.default,
      },
      [`&:hover`]: {
        color: tokens.kda.foundation.color.text.subtle.inverse.default,
        opacity: '.6',
      },
      [`${darkThemeClass} &:hover`]: {
        color: tokens.kda.foundation.color.text.subtle.default,
        opacity: '.6',
      },
    },
  },
]);

export const iconButtonClass = style([
  atoms({
    backgroundColor: 'transparent',
  }),
]);

export const hamburgerButtonClass = style([
  {
    color: tokens.kda.foundation.color.neutral.n10,
    backgroundColor: tokens.kda.foundation.color.neutral.n60,
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: tokens.kda.foundation.color.neutral.n40,
        color: tokens.kda.foundation.color.neutral.n90,
      },
      '&:hover': {
        opacity: 0.6,
      },
    },

    ...responsiveStyle({
      md: {
        display: 'none',
      },
    }),
  },
]);

export const searchButtonClass = style([
  atoms({ paddingInline: 'sm' }),
  {
    width: 'inherit',

    color: tokens.kda.foundation.color.neutral.n10,
    backgroundColor: tokens.kda.foundation.color.neutral.n60,
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: tokens.kda.foundation.color.neutral.n40,
        color: tokens.kda.foundation.color.neutral.n90,
      },
      '&:hover': {
        opacity: 0.6,
      },
    },
  },
]);

export const searchButtonSlashClass = style([
  atoms({
    borderRadius: 'lg',
    marginInlineStart: 'sm',
  }),
  {
    backgroundColor: tokens.kda.foundation.color.neutral.n40,
    color: tokens.kda.foundation.color.neutral.n10,
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: tokens.kda.foundation.color.neutral.n60,
        color: tokens.kda.foundation.color.neutral.n90,
      },
    },
  },
]);

export const headerClass = style([
  atoms({
    position: 'sticky',
    top: 0,
    backgroundColor: 'layer-1.inverse.default',
  }),
  {
    color: tokens.kda.foundation.color.neutral.n0,
    gridArea: 'header',
    zIndex: $$navMenu,
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor:
          tokens.kda.foundation.color.background['layer-1'].default,
      },
    },
  },
]);

export const skipNavClass = style([
  atoms({
    position: 'absolute',
    top: 0,
    left: 0,
    fontWeight: 'bodyFont.bold',
    opacity: 0,
    paddingBlock: 'sm',
    paddingInline: 'md',
  }),
  {
    color: tokens.kda.foundation.color.neutral.n0,
    backgroundColor: 'red',
    transform: 'translateY(-40px)',
    transition: 'transform .1s ease-in, opacity .1s ease-in',
    zIndex: $$modalZIndex,
    selectors: {
      '&:focus': {
        transform: 'translateY(0)',
        opacity: 1,
      },
    },
  },
]);

export const innerWrapperClass = style([
  atoms({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    paddingInline: 'md',
  }),
  {
    marginInline: 'auto',
    marginBlock: 0,
    paddingBlock: tokens.kda.foundation.size.n3,
    maxWidth: $$pageWidth,
  },
]);

export const spacerClass = style({
  flex: 1,
});

export const headerIconGroupClass = style([
  atoms({
    display: 'flex',
    gap: {
      xs: 'sm',
      lg: 'sm',
    },
    marginInlineStart: 'sm',
  }),
]);

export const socialGroupClass = style({
  display: 'none',
  ...responsiveStyle({
    lg: {
      display: 'flex',
    },
  }),
});

export const animationBackgroundClass = style([
  atoms({
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    opacity: 0,
  }),
]);

export const animationBackgroundShowVariant = styleVariants({
  show: {
    opacity: 1,
  },
  hide: {
    opacity: 0,
  },
});

export const navClass = style([
  atoms({
    display: 'none',
    alignItems: 'center',
    zIndex: 1,
  }),
  responsiveStyle({
    md: {
      display: 'flex',
      marginTop: '-1px',
    },
  }),
]);

export const ulClass = style([
  atoms({
    display: 'flex',
    gap: 'md',
    padding: 'no',
    width: '100%',
  }),
  {
    listStyle: 'none',
  },
]);

export const navLinkClass = style([
  atoms({
    color: 'text.base.inverse.default',
    fontFamily: 'bodyFont',
    textDecoration: 'none',
    borderRadius: 'sm',
  }),
  {
    padding: `${tokens.kda.foundation.size.n1} clamp(${tokens.kda.foundation.size.n1}, .5vw, ${tokens.kda.foundation.size.n12})`,
    fontSize: `clamp(${tokens.kda.foundation.size.n3}, 1.4vw, ${tokens.kda.foundation.size.n4})`,
    selectors: {
      '&:hover': {
        color: tokens.kda.foundation.color.text.base.inverse.default,
        opacity: '.5',
      },
      [`${darkThemeClass} &`]: {
        color: tokens.kda.foundation.color.text.base.default,
      },
    },
  },
]);

export const hideOnMobileClass = style([
  atoms({
    display: 'none',
  }),
  responsiveStyle({
    md: {
      display: 'flex',
    },
  }),
]);
