import { style, token } from '../../../styles';

export const buttonClass = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: token('radius.md'),
  cursor: 'pointer',
  border: 'none',
  backgroundColor: token('color.background.base.default'),
  color: token('color.text.base.default'),
  width: token('size.n8'),
  height: token('size.n8'),
  selectors: {
    [`&:hover`]: {
      backgroundColor: token('color.background.base.@hover'),
      color: token('color.background.base.default'),
    },
  },
  ':disabled': {
    opacity: 0.7,
    backgroundColor: token('color.icon.base.@disabled'),
    color: token('color.text.base.@disabled'),
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
});
