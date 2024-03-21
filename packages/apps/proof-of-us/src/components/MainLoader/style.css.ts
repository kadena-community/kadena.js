import { deviceColors } from '@/styles/tokens.css';
import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const loaderWrapperClass = style([
  atoms({
    position: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    inset: 0,
  }),
  {
    backgroundColor: `${deviceColors.kadenaBlack}b8`,
    zIndex: 1000,
  },
]);
