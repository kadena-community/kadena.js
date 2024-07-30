import { token } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const tokenBadgeWrapperClass = style({
  position: 'absolute',
  top: '8px',
  right: '8px',
  backgroundColor: token('color.background.accent.primary.@hover'),
  padding: '4px 10px',
  borderRadius: '16px',
});
