import '@kadena/react-ui/global';
import { atoms } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

globalStyle('body', {
  color: 'white',
  backgroundColor: '#081320',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  '@media': {
    '(orientation: portrait)': {
      backgroundImage: `url("/assets/bg-portrait.png")`,
    },
    '(orientation: landscape)': {
      backgroundImage: `url("/assets/bg-landscape.jpg")`,
    },
  },
});

globalStyle('a', {
  color: 'white',
});

globalStyle('a:hover', {
  color: 'lightgray',
  textDecoration: 'none',
});

export const mainWrapperClass = style({
  position: 'absolute',
  top: 0,
  maxWidth: '800px',
  width: '100%',
  height: '100dvh',
  margin: '0 auto',
  paddingBlock: '20px',
  paddingBlockStart: '80px',
  paddingInline: '20px',
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
