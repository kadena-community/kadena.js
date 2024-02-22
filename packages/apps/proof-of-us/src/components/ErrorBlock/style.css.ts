import { deviceColors } from '@/styles/tokens.css';
import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const errorWrapperClass = style([
  atoms({
    padding: 'md',
  }),
  {
    backgroundColor: deviceColors.backgroundTransparentColor,
    border: `1px solid  ${deviceColors.red}`,
  },
]);
