import { style } from '@vanilla-extract/css';
import { token } from '../../styles';
import { atoms } from '../../styles/atoms.css';

export const textLinkClass = style([
  atoms({
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 'xs',
    gap: 'sm',
    paddingBlock: 'sm',
  }),
  {
    color: token('color.link.base.default'),
    selectors: {
      '&[data-hovered]': {
        textDecoration: 'underline',
        background: 'none',
        color: `${token('color.link.base.@focus')} !important`,
      },
      '&[data-focus-visible]': {
        textDecoration: 'underline',
        color: `${token('color.link.base.@focus')} !important`,
      },
      '&[data-disabled]': {
        cursor: 'not-allowed',
      },
      '&:visited': {
        color: token('color.link.base.@visited'),
      },
    },
  },
]);
