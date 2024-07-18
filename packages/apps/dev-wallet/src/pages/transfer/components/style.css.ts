import { atoms, tokens, vars } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const PreviewModalClass = style({
  backgroundColor: tokens.kda.foundation.color.neutral.n1,
});

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

export const discoverdAccountClass = style([
  {
    backgroundColor: vars.colors.$layoutSurfaceCard,
    selectors: {
      '&:nth-child(odd)': {
        backgroundColor: vars.colors.$layoutSurfaceDefault,
      },
    },
  },
  atoms({
    padding: 'md',
  }),
]);
