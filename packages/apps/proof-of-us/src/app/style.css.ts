import { style } from '@vanilla-extract/css';

export const mainWrapperClass = style({
  position: 'relative',
  maxWidth: '800px',
  margin: '0 auto',
  height: '100dvh',
  paddingBlock: '20px',
  paddingInline: '20px',
  marginBlockEnd: '350px',
  overflowY: 'scroll',
  overflowX: 'hidden',
});
