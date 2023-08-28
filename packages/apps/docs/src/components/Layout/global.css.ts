import { createVar, style } from '@vanilla-extract/css';

export const $$navMenu = createVar();
export const $$pageWidth = createVar();
export const $$leftSideWidth = createVar();
export const $$sideMenu = createVar();

export const globalClass = style({
  vars: {
    [$$navMenu]: '998', //zIndex
    [$$sideMenu]: '500', //zIndex
    [$$pageWidth]: '1440px', //sizes
    [$$leftSideWidth]: '265px', //sizes
  },
});
