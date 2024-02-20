import { deviceColors } from '@/styles/tokens.css';
import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const buttonClass = style([
  atoms({
    padding: 'md',
  }),
  {
    color: deviceColors.kadenaBlack,
    textTransform: 'uppercase',
    width: '100%',
  },
]);
