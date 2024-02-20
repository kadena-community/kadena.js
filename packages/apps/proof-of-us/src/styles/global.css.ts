import '@kadena/react-ui/global';
import { atoms } from '@kadena/react-ui/styles';
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
  top: 0,
  maxWidth: '800px',
  width: '100%',
  height: '100dvh',
  margin: '0 auto',
  paddingBlockEnd: '20px',

  overflowY: 'scroll',
  overflowX: 'hidden',
});

export const centerClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  {
    height: '50vh',
  },
]);
export const emptyListLinkClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'sm',
    fontWeight: 'bodyFont.bold',
    fontSize: 'xl',
  }),
]);
