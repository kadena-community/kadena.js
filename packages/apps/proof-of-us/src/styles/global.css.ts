import '@kadena/react-ui/global';
import { globalStyle, style } from '@vanilla-extract/css';
import { deviceColors } from './tokens.css';

globalStyle('body', {
  color: 'white',
  backgroundColor: deviceColors.kadenaBlack,
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
  maxWidth: '800px',
  width: '100%',
  height: '100dvh',
  margin: '0 auto',

  overflowY: 'scroll',
  overflowX: 'hidden',
});

export const secondaryTextClass = style({
  color: deviceColors.kadenaFont,
  opacity: '.8',
  textAlign: 'center',
});
