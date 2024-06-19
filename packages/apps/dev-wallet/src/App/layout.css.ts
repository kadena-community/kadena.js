import { atoms, vars } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

const minHeaderHeight = '90px';
export const headerStyle = style({
  borderBottom: `1px solid ${vars.colors.$layoutSurfaceCard}`,
  minHeight: minHeaderHeight,
});

export const mainColumnStyle = style([
  atoms({
    width: '100%',
    color: 'text.base.default',
    position: 'relative',
    zIndex: 0,
  }),
]);

export const selectNetworkClass = style({
  maxWidth: '200px',
});

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
