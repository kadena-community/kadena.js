import {
  atoms,
  darkThemeClass,
  responsiveStyle,
  tokens,
} from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';
import { $$modalZIndex, $$navMenu, $$pageWidth } from '../../global.css';

export const headerClass = style([
  atoms({
    position: 'sticky',
    top: 0,
  }),
  {
    gridArea: 'header',
    zIndex: $$navMenu,
  },
]);

globalStyle(`${headerClass} > nav > div`, {
  maxWidth: $$pageWidth,
});

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
    display: 'none',
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
    ...responsiveStyle({
      lg: {
        display: 'block',
      },
    }),
  },
]);

export const skipNavClass = style([
  atoms({
    position: 'absolute',
    top: 0,
    left: 0,
    fontWeight: 'secondaryFont.bold',
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

export const headerButtonClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBlock: 'sm',
    borderRadius: 'lg',
    cursor: 'pointer',
    color: 'text.base.inverse.default',
    flexShrink: 0,
  }),
  {
    border: 0,
    opacity: 0.8,
    transition: `opacity 0.2s ease`,
    selectors: {
      [`&:hover, &:focus-visible`]: {
        opacity: '1',
      },
    },
  },
]);

export const hideOnTabletClass = style([
  responsiveStyle({
    xs: { display: 'none' },
    md: { display: 'flex' },
  }),
]);

export const navLinkClass = style([
  {
    fontSize: `clamp(${tokens.kda.foundation.size.n3}, 1.4vw, ${tokens.kda.foundation.size.n4})`,
  },
]);

export const socialsClass = style([
  responsiveStyle({
    xs: { display: 'flex' },
    xl: { display: 'flex' },
  }),
]);

export const baseIcon = style([
  {
    transition: '400ms transform ease',
  },
]);

export const reversedIcon = style([
  {
    transform: 'rotate(180deg)',
  },
]);
