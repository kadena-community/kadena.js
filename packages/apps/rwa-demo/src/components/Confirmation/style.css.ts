import { globalStyle, style } from '@vanilla-extract/css';

export const complianceWrapperClass = style({});

globalStyle(
  `body:has(div${complianceWrapperClass}) [class^="Dialog"][role="dialog"]`,
  {
    minHeight: '200px!important',
    maxHeight: 'fit-content!important',
  },
);
