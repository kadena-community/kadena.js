import { atoms, recipe, responsiveStyle, style, token } from './../../styles';

export const minHeaderHeight = '60px';

export const layoutWrapperClass = recipe({
  base: [
    atoms({ width: '100%', display: 'grid', flex: 1 }),
    {
      minHeight: '100%',
    },
  ],
  compoundVariants: [
    {
      variants: {
        variant: 'default',
        hasTopBanner: false,
      },
      style: [
        responsiveStyle({
          xs: {
            gridTemplateColumns: 'auto',
            gridTemplateRows: `${minHeaderHeight} 1fr 60px`,
            gridTemplateAreas: `
            "sidebarlayout-header"
            "sidebarlayout-main"
            "sidebarlayout-footer"
          `,
          },
          md: {
            gridTemplateColumns: '45px auto',
            gridTemplateRows: `${minHeaderHeight} 1fr`,
            gridTemplateAreas: `
            "sidebarlayout-sidebar sidebarlayout-header"
            "sidebarlayout-sidebar sidebarlayout-main"
          `,
          },
        }),
      ],
    },
    {
      variants: {
        variant: 'default',
        hasTopBanner: true,
      },
      style: [
        responsiveStyle({
          xs: {
            gridTemplateColumns: 'auto',
            gridTemplateRows: `minMax(0px, 60px) ${minHeaderHeight} 1fr 60px`,
            gridTemplateAreas: `
            "sidebarlayout-topbanner"
            "sidebarlayout-header"
            "sidebarlayout-main"
            "sidebarlayout-footer"
          `,
          },
          md: {
            gridTemplateColumns: '45px auto',
            gridTemplateRows: `minMax(0px, 60px) ${minHeaderHeight} 1fr`,
            gridTemplateAreas: `
            "sidebarlayout-topbanner sidebarlayout-topbanner"
            "sidebarlayout-sidebar sidebarlayout-header"
            "sidebarlayout-sidebar sidebarlayout-main"
          `,
          },
        }),
      ],
    },
  ],
  variants: {
    hasTopBanner: {
      true: {},
      false: {},
    },
    variant: {
      full: [
        style({
          gridTemplateColumns: 'auto',
          gridTemplateRows: `60px ${minHeaderHeight} 1fr`,
          gridTemplateAreas: `
            "sidebarlayout-topbanner"
            "sidebarlayout-header"
            "sidebarlayout-main"
          `,
        }),
      ],
      default: [],
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

export const bodyWrapperClass = style({
  minHeight: '100dvh',
  backgroundColor: token('color.background.base.default'),
});

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
