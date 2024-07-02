import { atoms, responsiveStyle, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';
import {
  $$backgroundOverlayColor,
  $$pageWidth,
  globalClass,
} from '../../global.css';

export const headerWrapperClass = style([
  globalClass,
  atoms({
    position: 'relative',
    display: 'grid',
  }),
  {
    gridArea: 'pageheader',
    height: `calc(${tokens.kda.foundation.size.n64} + ${tokens.kda.foundation.spacing.xxxl})`,
    gridTemplateRows: `${tokens.kda.foundation.size.n64} ${tokens.kda.foundation.spacing.xxxl}`,
    gridTemplateAreas: `
    "main"
    "shadow"
    `,
    zIndex: 99,

    selectors: {
      '&::before': {
        content: '',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: tokens.kda.foundation.spacing.xxxl,
      },
      '&::after': {
        content: '',
        position: 'absolute',
        inset: 0,
        // background: 'url("/assets/bg-horizontal.webp")',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'center',
        backgroundPositionY: '95%',
        transform: 'scaleY(.3) translateY(-100%)',
        opacity: 0,

        transition: 'transform 1s ease, opacity 2s  ease-out',
        transitionDelay: '600ms',
      },
    },

    ...responsiveStyle({ md: { zIndex: 101 } }),
  },
]);

export const headerLoadedClass = style({
  selectors: {
    '&::after': {
      transform: 'scaleY(1) translateY(0) ',
      opacity: 1,
    },
  },
});

export const headerClass = style([
  atoms({
    position: 'relative',
  }),
  {
    gridArea: 'main',
    zIndex: 3,
    backgroundColor: $$backgroundOverlayColor,
  },
]);

export const wrapperClass = style([
  atoms({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginInline: 'auto',
    marginBlockStart: 'no',
  }),
  {
    marginBlockEnd: tokens.kda.foundation.spacing.lg,
    paddingBlockEnd: tokens.kda.foundation.spacing.xxxl,
    paddingBlockStart: tokens.kda.foundation.size.n20,
    paddingInline: tokens.kda.foundation.spacing.md,
    maxWidth: $$pageWidth,
  },
]);

export const subheaderClass = style([
  atoms({
    color: 'text.base.default',
    textAlign: 'center',
  }),
]);
