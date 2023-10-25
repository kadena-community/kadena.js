import { vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  {
    display: 'grid',
    gridTemplateColumns: `calc(${vars.sizes.$64} + ${vars.sizes.$16}) 1fr`, // 20rem 1fr
  },
]);
