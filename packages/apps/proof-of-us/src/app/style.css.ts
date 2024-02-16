import { style } from '@vanilla-extract/css';

export const mainWrapperClass = style({
  position: 'absolute',
  top: 0,
  maxWidth: '800px',
  width: '100%',
  height: '100dvh',
  margin: '0 auto',
  paddingBlock: '20px',
  paddingBlockStart: '80px',
  paddingInline: '20px',
  overflowY: 'scroll',
  overflowX: 'hidden',
});
