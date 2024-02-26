import { deviceColors } from '@/styles/tokens.css';
import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const imageWrapper = style([
  atoms({
    position: 'relative',
  }),
  {
    marginLeft: '-12px',
    marginRight: '-12px',
  },
]);

export const titleErrorClass = style([
  atoms({
    color: 'icon.semantic.warning.default',
  }),
]);

export const infoTextClass = style({
  opacity: '0.6',
  marginBottom: '24px',
});

export const checkClass = style({
  fill: deviceColors.kadenaBlack,
});
