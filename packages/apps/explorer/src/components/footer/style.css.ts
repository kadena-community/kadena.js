import { atoms, responsiveStyle, style, tokens } from '@kadena/kode-ui/styles';
import { $$pageWidth } from '../layout/styles.css';

export const footerClass = style([
  atoms({
    width: '100%',
    paddingBlockStart: 'xl',
    paddingBlockEnd: 'md',
    paddingInlineStart: 'xxxl',
    paddingInlineEnd: 'md',
    borderColor: 'base.subtle',
    borderWidth: 'hairline',
  }),
  {
    borderTop: 'solid',
    backgroundColor: tokens.kda.foundation.color.background.surface.default,
    marginInline: 'auto',
    maxWidth: $$pageWidth,
  },
]);

export const doubleContentClass = style([
  {
    display: 'none',
    flex: 1,
  },
  responsiveStyle({
    lg: {
      flex: 2,
    },
  }),
]);

export const tripleContentClass = style([
  {
    display: 'none',
    flex: 1,
  },
  responsiveStyle({
    lg: {
      flex: 3,
    },
  }),
]);

export const socialLinkClass = style([
  atoms({
    color: 'icon.base.default',
  }),
]);

export const footerLinkClass = style({
  textDecoration: 'none',
  selectors: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

export const footerColumnClass = style({
  flex: 1,
});

export const isClosedClass = style([
  {
    display: 'none!important',
  },
  responsiveStyle({
    sm: {
      display: 'flex!important',
    },
  }),
]);
