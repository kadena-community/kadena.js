import { tokens } from '@kadena/kode-ui/styles';
import '@kadena/kode-ui/global';
import { globalStyle, style } from '@vanilla-extract/css';

globalStyle('body', {
  color: 'white',
  backgroundColor: tokens.kda.foundation.color.background.base.default,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
});

globalStyle('a', {
  color: 'white',
});

globalStyle('a:hover', {
  color: 'lightgray',
  textDecoration: 'none',
});

export const mainWrapperClass = style({
  position: 'relative',
  top: 0,
  width: '100%',
  height: '100dvh',
  margin: '0 auto',
  paddingBottom: '50px',

  overflowY: 'auto',
  overflowX: 'hidden',
});

export const secondaryTextClass = style({
  opacity: '.8',
  textAlign: 'center',
});

globalStyle('a:has(button)', {
  textDecoration: 'none',
  flex: 1,
});
