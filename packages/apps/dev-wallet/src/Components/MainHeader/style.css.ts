import { vars } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

const minHeaderHeight = '90px';
export const headerStyle = style({
  borderBottom: `1px solid ${vars.colors.$layoutSurfaceCard}`,
  minHeight: minHeaderHeight,
});

export const selectNetworkClass = style({
  minWidth: '180px',
});
