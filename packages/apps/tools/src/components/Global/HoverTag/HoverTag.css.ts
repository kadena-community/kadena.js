import { atoms } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const iconButtonClass = style([
  atoms({
    border: 'none',
    background: 'none',
    padding: 'xs',
    cursor: 'pointer',
  }),
]);

export const containerClass = style([atoms({ display: 'flex' })]);
