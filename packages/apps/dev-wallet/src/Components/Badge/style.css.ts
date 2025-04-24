import { vars } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const chainClass = style([
  {
    background: vars.colors.$layoutSurfaceCard,
    border: `1px solid ${vars.colors.$borderDefault}`,
    fontSize: 'smaller',
  },
]);
