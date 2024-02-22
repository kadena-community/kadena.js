import { deviceColors } from '@/styles/tokens.css';
import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const textClass = style([
  atoms({
    padding: 'md',
    marginBlock: 'sm',
    borderRadius: 'md',
    width: '100%',
    fontSize: 'base',
  }),
  {
    color: deviceColors.kadenaFont,
    border: '1px solid rgba(255,255,255, .3)',
    backgroundColor: 'rgba(255,255,255, 0.1)',
  },
]);
