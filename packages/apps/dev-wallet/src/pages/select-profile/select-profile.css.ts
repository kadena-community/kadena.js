import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

const cardColor = 'rgba(255, 255, 255, 0.03)';
const cardBackgroundColorHover = 'rgba(255, 255, 255, 0.07)';
const cardColorHover = 'rgba(255, 255, 255, 0.2)';

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
    borderRadius: '2px',
    backgroundColor: cardColor,
  },
]);
export const aliasClass = style([
  atoms({
    fontSize: 'sm',
  }),
  { color: '#ffffff' },
]);

export const initialsClass = style([
  atoms({
    fontSize: '9xl',
    fontWeight: 'secondaryFont.bold',
  }),
]);

export const formField = atoms({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: 'sm',
});

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

export const linkTextClass = style([
  atoms({
    fontSize: 'sm',
    lineHeight: 'sm',
  }),
  {
    color: tokens.kda.foundation.color.palette.aqua.n50,
  },
]);
