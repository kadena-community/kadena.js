import {
  $$backgroundOverlayColor,
  $$pageWidth,
} from '@/components/Layout/global.css';
import {
  atoms,
  darkThemeClass,
  responsiveStyle,
  tokens,
} from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const mostPopularBoxClass = style([
  {
    ...responsiveStyle({
      sm: {
        paddingInlineStart: tokens.kda.foundation.spacing.xs,
      },
      lg: {
        paddingInlineStart: tokens.kda.foundation.size.n15,
      },
      xl: {
        paddingInlineStart: tokens.kda.foundation.size.n32,
      },
      xxl: {
        paddingInlineStart: tokens.kda.foundation.size.n48,
      },
    }),
  },
]);

export const headerClass = style([
  atoms({
    position: 'relative',
    margin: 'no',
    padding: 'no',
  }),
  {
    maxWidth: '100vw',
    gridArea: 'pageheader',
    zIndex: 2,
    selectors: {
      '&::before': {
        content: '',
        position: 'absolute',
        inset: 0,
        bottom: `calc(0px - ${tokens.kda.foundation.size.n5})`,
        // background: 'url("/assets/bg-horizontal.webp")',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'center',
        backgroundPositionY: '0%',
        transform: 'scale(-1, -0.3) translate(0, 100%)',
        opacity: 0,

        transition: 'transform 1s ease, opacity 2s  ease-out',
        transitionDelay: '600ms',
      },
    },
  },
]);

export const headerLoadedClass = style({
  selectors: {
    '&::before': {
      transform: 'scale(-1, -1.5) translate(0, 70px)',
      opacity: 1,
    },
  },
});

export const wrapperClass = style([
  atoms({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    paddingInline: 'xxxl',
  }),
  {
    paddingBlockStart: tokens.kda.foundation.size.n20,
    paddingBlockEnd: tokens.kda.foundation.size.n20,
    marginInline: 'auto',
    marginBlockEnd: tokens.kda.foundation.size.n16,
    maxWidth: $$pageWidth,
    backgroundColor: $$backgroundOverlayColor,
    boxSizing: 'border-box',
  },
]);

export const searchWrapperClass = style({
  paddingBlockEnd: 0,
});

export const subheaderClass = style([
  atoms({
    color: 'text.base.default',
    fontSize: 'xl',
  }),
  {
    selectors: {
      [`${darkThemeClass} &`]: {
        color: tokens.kda.foundation.color.text.subtle.default,
      },
    },
  },
]);

export const searchInputWrapper = style({
  marginBlockStart: tokens.kda.foundation.size.n5,
  maxWidth: `calc(3 * ${tokens.kda.foundation.size.n40})`,
});
