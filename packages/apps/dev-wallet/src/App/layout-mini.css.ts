import { atoms, vars } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

const minHeaderHeight = '90px';

export const headerStyle = style({
  borderBottom: `1px solid ${vars.colors.$layoutSurfaceCard}`,
  minHeight: minHeaderHeight,
});

export const mainStyle = style([
  atoms({
    width: '100%',
    color: 'text.base.default',
    display: 'flex',
    alignItems: 'center',
  }),
  {
    minHeight: `calc(100vh - ${minHeaderHeight})`,
    background: 'transparent', // fallback in case radial-gradient is not working
    backgroundImage:
      'radial-gradient(circle farthest-side at 50% 170%, #42CEA0, transparent 75%)',
    backgroundRepeat: 'no-repeat',
  },
]);

export const containerStyle = style([
  atoms({
    padding: 'sm',
  }),
  {
    width: '474px',
    maxWidth: '100%',
    margin: '0 auto',
    textAlign: 'center',
  },
]);
