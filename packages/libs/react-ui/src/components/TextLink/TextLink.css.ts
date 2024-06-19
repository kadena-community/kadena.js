import { style } from '@vanilla-extract/css';
import { token } from '../../styles';

export const textLinkClass = style({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: token('spacing.xs'),
  gap: token('spacing.sm'),
  paddingBlock: token('spacing.sm'),
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
});
