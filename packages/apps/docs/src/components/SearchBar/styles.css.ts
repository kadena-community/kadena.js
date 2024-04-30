import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const searchFormClass = style([
  atoms({
    width: '100%',
  }),
]);

export const buttonClass = style([
  atoms({
    border: 'none',
    paddingInline: 'n2',
    cursor: 'pointer',
  }),
  {
    backgroundColor: 'transparent',
  },
]);
