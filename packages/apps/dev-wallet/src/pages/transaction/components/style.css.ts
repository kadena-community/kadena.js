import { tokens, vars } from '@kadena/kode-ui/styles';
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

export const signedClass = style({
  background: vars.colors.$positiveContrast,
  padding: '2px 5px',
  borderRadius: '3px',
  fontWeight: 'bold',
});

export const readyToSignClass = style({
  background: vars.colors.$primaryLowContrast,
  padding: '2px 5px',
  borderRadius: '3px',
  fontWeight: 'bold',
});

export const tagClass = style({
  background: vars.colors.$layoutSurfaceCard,
  padding: '2px 5px',
  borderRadius: '3px',
  fontWeight: 'bold',
});

export const pendingClass = style({
  color: vars.colors.$warningHighContrast,
});

export const successClass = style({
  color: vars.colors.$positiveAccent,
});

export const failureClass = style({
  color: vars.colors.$negativeAccent,
});

export const pendingText = style({
  opacity: 0.5,
});
