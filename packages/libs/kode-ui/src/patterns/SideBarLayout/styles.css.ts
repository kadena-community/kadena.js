import { atoms, responsiveStyle, style } from './../../styles';

export const layoutWrapperClass = style([
  atoms({ width: '100%', display: 'grid', flex: 1 }),
  {
    minHeight: '100%',
  },

  responsiveStyle({
    xs: {
      gridTemplateColumns: 'auto',
      gridTemplateRows: '60px auto 60px',
      gridTemplateAreas: `
      "sidebarlayout-header"
      "sidebarlayout-main"
      "sidebarlayout-footer"
    `,
    },
    md: {
      gridTemplateColumns: '50px auto',
      gridTemplateRows: '60px auto',
      gridTemplateAreas: `
      "sidebarlayout-header sidebarlayout-header"
      "sidebarlayout-sidebar sidebarlayout-main"
    `,
    },
  }),
]);

export const layoutExpandedWrapperClass = style([
  responsiveStyle({
    md: {
      gridTemplateColumns: '200px auto',
    },
  }),
]);
