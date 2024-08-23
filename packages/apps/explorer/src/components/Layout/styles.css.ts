import { atoms, tokens } from '@kadena/kode-ui/styles';
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

export const asideContentBlockClass = style([
  atoms({
    borderRadius: 'xs',
    padding: 'sm',
    wordBreak: 'break-all',
    width: '100%',
  }),
  {
    alignSelf: 'self-start',
    backgroundColor: tokens.kda.foundation.color.background.base.default,
  },
]);
export const asideContentBlockLabelClass = style([
  atoms({
    color: 'text.gray.default',
  }),
]);
