import '@kadena/kode-ui/global';
import { responsiveStyle } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const stickyHeader = style({
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: 1000,
});

export const mainContainer = style({
  margin: '120px 5% 0',
});

export const layoutClass = style([
  {
    width: '100%',
    maxWidth: '100%',
    marginInline: 'auto',
    flexDirection: 'column',
  },
  responsiveStyle({
    md: {
      maxWidth: '60rem',
    },
  }),
]);

globalStyle(`${layoutClass} [class^="CardPattern"]`, {
  width: '100%',
});

globalStyle(`${layoutClass} [class^="CardPattern"] [class^="Card"]`, {
  width: '100%',
  marginInlineStart: '0',
  transform: 'translateX(0)',
});
