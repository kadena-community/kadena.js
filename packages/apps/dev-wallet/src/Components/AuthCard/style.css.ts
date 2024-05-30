import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const authCard = style([
  atoms({
    padding: 'xxl',
  }),
  {
    borderRadius: '1px',
    textAlign: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
]);

export const backButtonClass = style([
  atoms({
    textDecoration: 'none',
    color: 'text.base.default',
  }),
]);

export const iconStyle = style([
  atoms({
    fontSize: 'sm',
    color: 'text.base.default',
  }),
]);
