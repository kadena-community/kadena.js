import { deviceColors } from '@/styles/tokens.css';
import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const iconClass = style([
  atoms({
    position: 'absolute',
    fontSize: 'lg',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  }),
  {
    pointerEvents: 'none',
    paddingInlineEnd: '5px',
    color: deviceColors.kadenaFont,
  },
]);

export const mobileInputClass = style({
  fontWeight: '400',
});
