import { tokens, vars } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const footerClass = style({
  paddingBlockStart: '10px',
});

export const breakAllClass = style({
  wordBreak: 'break-all',
});

export const cardClass = style({
  padding: '10px',
  border: `1px solid ${vars.colors.$layoutSurfaceCard}`,
  borderRadius: '5px',
});

export const codeClass = style({
  padding: '10px',
  borderRadius: '3px',
  backgroundColor: tokens.kda.foundation.color.neutral.n10,
});

export const labelClass = style({
  maxWidth: '200px',
  flex: '1',
});

export const containerClass = style({
  padding: '30px',
  border: `1px solid ${vars.colors.$layoutSurfaceCard}`,
  borderRadius: '5px',
  backgroundColor: tokens.kda.foundation.color.neutral.n1,
});
