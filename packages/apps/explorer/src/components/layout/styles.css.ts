import { tokens } from '@kadena/kode-ui/styles';
import { createVar, style } from '@vanilla-extract/css';

export const $$pageWidth = createVar();

export const documentStyle = style({
  vars: {
    [$$pageWidth]: tokens.kda.foundation.breakpoint.xxl, // '1440px',
  },
});

export const layoutWrapperClass = style({
  position: 'relative',
  marginInline: 'auto',
  maxWidth: $$pageWidth,
});

export const contentClass = style({
  minHeight: 'calc(100vh - 248px)',
});
