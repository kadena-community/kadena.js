import { createVar, style } from '@vanilla-extract/css';

export const $$navMenu = createVar();
export const $$pageWidth = createVar();
export const $$leftSideWidth = createVar();

export const globalsClass = style({
  vars: {
    [$$navMenu]: '998',
    [$$pageWidth]: '1440px',
    [$$leftSideWidth]: '265px',
  },
});
