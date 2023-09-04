import { breakpoints } from '@kadena/react-ui/theme';

import { $$leftSideWidth, $$pageWidth } from '../global.css';

import { style } from '@vanilla-extract/css';

export const pageGridClass = style({
  gridTemplateColumns: 'auto auto',
  gridTemplateAreas: `
            "header header"
            "pageheader pageheader"
            "content content"
            "footer footer"
          `,
  '@media': {
    [`screen and ${breakpoints.md}`]: {
      gridTemplateColumns: `1% ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth})) 1%`,

      gridTemplateAreas: `
                "header header header header"
                "pageheader pageheader pageheader pageheader"
                ". menu content ."
                "footer footer footer footer"
              `,
    },
    [`screen and ${breakpoints.xxl}`]: {
      gridTemplateColumns: `minmax(1%, auto) ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth})) minmax(1%, auto)`,
    },
  },
});
