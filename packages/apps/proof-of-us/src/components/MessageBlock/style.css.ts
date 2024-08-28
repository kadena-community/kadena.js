import { deviceColors } from '@/styles/tokens.css';
import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const errorWrapperClass = style([
  atoms({
    padding: 'md',
  }),
  {
    backgroundColor: deviceColors.backgroundTransparentColor,

    wordWrap: 'break-word',
    selectors: {
      '&[data-type="error"]': {
        border: `1px solid  ${deviceColors.red}`,
      },
      '&[data-type="success"]': {
        border: `1px solid  ${deviceColors.green}`,
      },
      '&[data-type="info"]': {
        border: `1px solid  ${deviceColors.yellow}`,
      },
    },
  },
]);
