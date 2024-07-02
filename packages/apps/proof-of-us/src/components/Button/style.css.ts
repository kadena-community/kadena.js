import { deviceColors } from '@/styles/tokens.css';
import { atoms } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const buttonClass = style([
  atoms({
    display: 'flex',
    gap: 'md',
    paddingInline: 'sm',
    paddingBlock: 'md',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  {
    color: deviceColors.kadenaBlack,
    textTransform: 'uppercase',
    width: '100%',
    selectors: {
      '&:hover': {
        opacity: '.8',
      },
    },
  },
]);

export const secondaryClass = style({
  color: deviceColors.kadenaFont,
  border: `1px solid ${deviceColors.kadenaFont}`,
});
export const tertiaryClass = style({
  border: '0',
  backgroundColor: deviceColors.orange,
});
export const disabledClass = style({
  opacity: 0.5,
});

globalStyle(`${buttonClass} a`, {
  textDecoration: 'none',
  display: 'block',
  color: deviceColors.kadenaBlack,
});

globalStyle(`${secondaryClass} a`, {
  color: deviceColors.kadenaFont,
});
