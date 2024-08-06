import { token } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const tokenBadgeWrapperClass = style({
  position: 'absolute',
  top: token('spacing.n2'),
  right:token('spacing.n2'),
  backgroundColor: token('color.background.accent.primary.@hover'),
  padding: '4px 10px',
  borderRadius: '16px',
});
