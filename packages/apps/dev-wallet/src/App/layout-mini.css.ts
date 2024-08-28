import { atoms, vars } from '@kadena/kode-ui/styles';
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
