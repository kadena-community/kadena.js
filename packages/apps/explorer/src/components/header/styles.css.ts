import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';
import { $$pageWidth } from '../layout/styles.css';

export const headerClass = style([
  atoms({
    padding: 'sm',
  }),
  {
    backgroundColor:
      tokens.kda.foundation.color.background.surfaceHighContrast.default,
    borderEndStartRadius: tokens.kda.foundation.radius.md,
    borderEndEndRadius: tokens.kda.foundation.radius.md,
    zIndex: tokens.kda.foundation.zIndex.sticky,
  },
]);

export const fixedClass = style({
  position: 'fixed',

  top: 0,
  transition: 'transform .5s ease',
  transform: 'translateY(-100%)',
  maxWidth: $$pageWidth,
});

export const fixedVisibleClass = style({
  transform: 'translateY(0%)',
});
