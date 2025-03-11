import { cardColor, linkBlockColor } from '@/utils/color.ts';
import { atoms, tokens, vars } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const titleClass = style([
  atoms({
    fontSize: '5xl',
    lineHeight: '7xl',
    marginBlockEnd: 'sm',
  }),
]);

export const subtitleClass = style([
  atoms({
    fontWeight: 'primaryFont.regular',
  }),
]);

export const imgClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 'xxl',
  }),
  {
    backgroundColor: cardColor,
  },
]);

export const initialsClass = style([
  atoms({
    fontWeight: 'primaryFont.bold',
    fontFamily: 'monospaceFont',
  }),
  {
    color: 'white',
  },
]);
