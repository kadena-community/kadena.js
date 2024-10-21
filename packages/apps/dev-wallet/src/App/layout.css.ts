import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const mainColumnStyle = style([
  atoms({
    overflow: 'auto',
    color: 'text.base.default',
    position: 'relative',
    zIndex: 0,
    flex: 1,
  }),
]);

export const backgroundStyle = style([
  atoms({
    display: 'block',
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    background: 'none',
    zIndex: -1,
  }),
  {
    content: ' ',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    filter: 'blur(100px)',
  },
]);
