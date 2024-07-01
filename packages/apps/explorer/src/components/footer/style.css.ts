import { atoms, style, tokens } from '@kadena/react-ui/styles';
import { $$pageWidth } from '../layout/styles.css';

export const footerClass = style([
  atoms({
    width: '100%',
    paddingBlockStart: 'xl',
    paddingBlockEnd: 'md',
    paddingInline: 'xxxl',
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

export const doubleContentClass = style({
  flex: 2,
});
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
