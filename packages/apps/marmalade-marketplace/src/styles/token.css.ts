// token.css.ts

import { token } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const mainWrapperClass = style({
  borderRadius: '16px',
  position: 'relative',
  cursor: 'pointer',
});

export const tokenBadgeWrapperClass = style({
  position: 'absolute',
  top: '8px',
  right: '8px',
  backgroundColor: token('color.background.accent.primary.@hover'),
  padding: '4px 10px',
  borderRadius: '16px',
});

export const tokenImageClass = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '16px',
});

export const tokenDescriptionClass = style({
  padding: '16px',
  position: 'absolute',
  bottom: 0,
  left: 0,
  wordBreak: 'break-all',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
});
