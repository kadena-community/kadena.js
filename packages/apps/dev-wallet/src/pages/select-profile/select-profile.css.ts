import { cardColor } from '@/utils/color.ts';
import { atoms, tokens } from '@kadena/kode-ui/styles';
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

export const linkClass = style([
  {
    textDecoration: 'none',
    color: tokens.kda.foundation.color.palette.aqua.n50,
    selectors: {
      [`&:hover`]: {
        textDecoration: 'underline',
      },
    },
  },
]);
