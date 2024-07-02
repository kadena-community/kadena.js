import {
  cardBackgroundColorHover,
  cardColor,
  cardColorHover,
  linkBlockColor,
} from '@/utils/color.ts';
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

export const cardClass = style([
  atoms({
    borderRadius: 'xs',
    padding: 'md',
    textAlign: 'center',
    fontFamily: 'secondaryFont',
    width: '100%',
  }),
  {
    backgroundColor: cardColor,
    border: `1px solid ${cardColor}`,
    selectors: {
      [`&:hover`]: {
        backgroundColor: cardBackgroundColorHover,
        borderColor: cardColorHover,
      },
    },
  },
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
    width: '40px',
    height: '40px',
    backgroundColor: cardColor,
  },
]);
export const aliasClass = style([
  atoms({
    fontSize: 'sm',
    fontFamily: 'primaryFont',
  }),
  { color: tokens.kda.foundation.color.neutral.n100 },
]);

export const initialsClass = style([
  atoms({
    fontSize: '9xl',
    fontWeight: 'secondaryFont.bold',
  }),
]);

export const linkBlockClass = style([
  {
    color: linkBlockColor,
    fontSize: tokens.kda.foundation.size.n4,
    lineHeight: tokens.kda.foundation.size.n5,
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
