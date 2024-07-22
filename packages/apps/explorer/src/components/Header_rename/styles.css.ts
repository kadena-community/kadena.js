import { atoms, responsiveStyle, token, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';
import { $$pageWidth } from '../Layout_rename/styles.css';

export const headerClass = style([
  atoms({
    padding: 'sm',
  }),
  {
    backgroundColor: token('color.background.overlay.default'),
    zIndex: tokens.kda.foundation.zIndex.overlay,
  },

  responsiveStyle({
    xxl: {
      borderEndStartRadius: tokens.kda.foundation.radius.md,
      borderEndEndRadius: tokens.kda.foundation.radius.md,
    },
  }),
]);

export const fixedClass = style({
  position: 'fixed',

  top: 0,
  transition: 'transform .5s ease',
  transform: 'translateY(-100%)',
  maxWidth: $$pageWidth,
  selectors: {
    '&:not([data-is-search-page="true"])': {
      transform: 'translateY(0%)',
    },
  },
});

export const fixedVisibleClass = style({
  transform: 'translateY(0%)',
});
