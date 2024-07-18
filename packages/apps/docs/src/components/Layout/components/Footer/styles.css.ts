import { atoms, darkThemeClass, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';
import { $$footerMenu, $$pageWidth } from '../../global.css';

export const footerWrapperClass = style([
  atoms({
    position: 'relative',
    backgroundColor: 'layer.default',
  }),
  {
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor:
          tokens.kda.foundation.color.background.surfaceHighContrast.default,
      },
    },
    marginBlockStart: tokens.kda.foundation.size.n40,
    zIndex: $$footerMenu,
    gridArea: 'footer',
  },
]);
export const logoClass = style({
  maxWidth: tokens.kda.foundation.size.n48,
});

export const footerClass = style([
  atoms({
    position: 'relative',
    display: 'flex',
    paddingInline: 'md',
    alignItems: {
      xs: 'flex-start',
      md: 'center',
    },

    flexDirection: {
      xs: 'column',
      md: 'row',
    },
  }),
  {
    paddingBlock: tokens.kda.foundation.size.n3,
    margin: '0 auto',
    maxWidth: $$pageWidth,
  },
]);

export const textClass = style([
  atoms({
    display: 'block',
    textAlign: 'center',
    color: 'text.subtlest.default',
  }),
  {
    selectors: {
      [`${darkThemeClass} &`]: {
        color: tokens.kda.foundation.color.text.subtlest.default,
      },
    },
    paddingInline: tokens.kda.foundation.size.n3,
  },
]);

export const linkClass = style([
  atoms({
    display: 'block',
    textDecoration: 'none',
    textAlign: 'center',
    color: 'text.subtlest.default',
  }),
  {
    paddingInline: tokens.kda.foundation.size.n3,
    selectors: {
      [`${darkThemeClass} &`]: {
        color: tokens.kda.foundation.color.text.subtlest.default,
      },
      '&:hover': {
        textDecoration: 'none',
        color: tokens.kda.foundation.color.text.subtlest['@hover'],
      },
    },
  },
]);
