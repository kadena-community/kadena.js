import { responsiveStyle } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';
import { $$leftSideWidth, $$pageWidth } from '../global.css';

export const pageGridClass = style({
  gridTemplateColumns: 'auto auto',
  gridTemplateAreas: `
            "header header"
            "pageheader pageheader"
            "content content"
            "footer footer"
          `,

  ...responsiveStyle({
    md: {
      gridTemplateColumns: `1% ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth})) 1%`,
      gridTemplateAreas: `
                "header header header header"
                "pageheader pageheader pageheader pageheader"
                ". menu content ."
                "footer footer footer footer"
              `,
    },
    xxl: {
      gridTemplateColumns: `minmax(1%, auto) ${$$leftSideWidth} minmax(auto, calc(${$$pageWidth} - ${$$leftSideWidth})) minmax(1%, auto)`,
    },
  }),
});
