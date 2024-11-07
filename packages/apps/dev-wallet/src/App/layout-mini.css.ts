import { atoms, vars } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

const minHeaderHeight = '90px';
export const headerStyle = style({
  borderBottom: `1px solid ${vars.colors.$layoutSurfaceCard}`,
  minHeight: minHeaderHeight,
});

export const containerStyle = style([
  atoms({
    padding: 'sm',
    display: 'flex',
    alignItems: 'center',
  }),
  {
    width: '500px',
    maxWidth: '100%',
    margin: '0 auto',
    textAlign: 'center',
    height: '100dvh',
  },
]);
