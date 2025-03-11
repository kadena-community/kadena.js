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

export const cardClass = style([
  atoms({
    borderRadius: 'xs',
    padding: 'md',
    textAlign: 'center',
    fontFamily: 'primaryFont',
    width: '100%',
  }),
  {
    cursor: 'pointer',
    backgroundColor: tokens.kda.foundation.color.background.base['@focus'],
    border: `solid 1px ${tokens.kda.foundation.color.neutral.n5}`,
    selectors: {
      [`&:hover`]: {
        backgroundColor: tokens.kda.foundation.color.background.base['@hover'],
        border: `solid 1px ${vars.colors.$borderSubtle}`,
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
    fontWeight: 'primaryFont.bold',
  }),
  {
    color: 'white',
  },
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
