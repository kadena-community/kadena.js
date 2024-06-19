import { tokens } from '@kadena/react-ui/styles';
import { createVar, style } from '@vanilla-extract/css';

export const $$pageWidth = createVar();

export const documentStyle = style({
  vars: {
    [$$pageWidth]: tokens.kda.foundation.breakpoint.xxl, // '1440px',
  },
});

export const layoutWrapperClass = style({
  marginInline: 'auto',
  maxWidth: $$pageWidth,
});
