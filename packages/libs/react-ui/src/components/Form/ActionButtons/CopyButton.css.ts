import { style } from '@vanilla-extract/css';
import { atoms, tokens } from '../../../styles';

export const buttonClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 'md',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'base.default',
    color: 'text.base.default',
  }),
  {
    width: '32px',
    height: '32px',
    selectors: {
      [`&:hover`]: {
        backgroundColor: tokens.kda.foundation.color.background.base['@hover'],
        color: tokens.kda.foundation.color.background.base.default,
      },
    },
    ':disabled': {
      opacity: 0.7,
      backgroundColor: tokens.kda.foundation.color.icon.base['@disabled'],
      color: tokens.kda.foundation.color.text.base['@disabled'],
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
]);
