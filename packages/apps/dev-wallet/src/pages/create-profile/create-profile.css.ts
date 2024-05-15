import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const authCard = style([
  atoms({
    padding: 'xxl',
  }),
  {
    borderRadius: '1px',
    textAlign: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
]);

export const inputClass = style([
  {
    color: tokens.kda.foundation.color.text.gray.default,
    backgroundColor: tokens.kda.foundation.color.background.layer.default,
    border: `1px solid ${tokens.kda.foundation.color.background.layer.default}`,
  },
  {},
]);

export const iconStyle = style([
  atoms({
    fontSize: 'sm',
    color: 'text.base.default',
  }),
]);

export const backBtnClass = style([
  atoms({
    textDecoration: 'none',
    color: 'text.base.default',
  }),
]);

export const buttonClass = style([
  atoms({
    textDecoration: 'none',
  }),
  {
    backgroundColor: tokens.kda.foundation.color.palette.aqua.n50,
    color: tokens.kda.foundation.color.neutral.n0,

    //TODO: Add active styles
    selectors: {
      [`&:hover`]: {},
    },
  },
]);
