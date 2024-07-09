import { tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const linkClass = style({
  color: tokens.kda.foundation.color.palette.aqua.n50,
  background: 'transparent',
  textAlign: 'left',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  selectors: {
    [`&:hover`]: {
      textDecoration: 'underline',
    },
  },
});

export const card = style([
  {
    borderRadius: '4px',
    textAlign: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxWidth: '635px',
  },
]);

export const disabledItemClass = style({
  color: tokens.kda.foundation.color.neutral.n50,
  cursor: 'not-allowed',
  flex: 1,
});
