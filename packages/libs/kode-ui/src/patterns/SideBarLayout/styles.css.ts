import { atoms, recipe, responsiveStyle, style } from './../../styles';

export const minHeaderHeight = '60px';

export const layoutWrapperClass = recipe({
  base: [
    atoms({ width: '100%', display: 'grid', flex: 1 }),
    {
      minHeight: '100%',
    },
  ],
  variants: {
    variant: {
      full: [
        style({
          gridTemplateColumns: 'auto',
          gridTemplateRows: `${minHeaderHeight} auto`,
          gridTemplateAreas: `
            "sidebarlayout-header"
            "sidebarlayout-main"
          `,
        }),
      ],
      default: [
        responsiveStyle({
          xs: {
            gridTemplateColumns: 'auto',
            gridTemplateRows: `${minHeaderHeight} auto 60px`,
            gridTemplateAreas: `
            "sidebarlayout-header"
            "sidebarlayout-main"
            "sidebarlayout-footer"
          `,
          },
          md: {
            gridTemplateColumns: '45px auto',
            gridTemplateRows: `${minHeaderHeight} auto`,
            gridTemplateAreas: `
            "sidebarlayout-header sidebarlayout-header"
            "sidebarlayout-sidebar sidebarlayout-main"
          `,
          },
        }),
      ],
    },
  },
});

export const layoutExpandedWrapperClass = style([
  responsiveStyle({
    md: {
      gridTemplateColumns: '200px auto',
    },
  }),
]);

export const mainClass = recipe({
  base: {
    overflowY: 'scroll',
    gridArea: 'sidebarlayout-main',
  },
  variants: {
    variant: {
      default: [],
      full: [
        atoms({
          width: '100%',
          color: 'text.base.default',
          display: 'flex',
          alignItems: 'center',
        }),
        {
          minHeight: `calc(100vh - ${minHeaderHeight})`,
          background: 'transparent', // fallback in case radial-gradient is not working
          backgroundRepeat: 'no-repeat',
        },
      ],
    },
  },
});
