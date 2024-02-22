import { deviceColors } from '@/styles/tokens.css';
import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const textClass = style([
  atoms({
    padding: 'md',
    borderRadius: 'md',
    width: '100%',
    fontSize: 'base',
  }),
  {
    color: deviceColors.kadenaFont,
    border: `1px solid  ${deviceColors.borderColor}`,
    backgroundColor: deviceColors.backgroundTransparentColor,
    backdropFilter: 'blur(10px)',
  },
]);
