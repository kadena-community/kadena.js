import { atoms, recipe, responsiveStyle, style, token } from './../../styles';

export const minHeaderHeight = '60px';
export const sideBarWidth = '232px';
export const sideBarMinWidth = '45px';

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
            gridTemplateColumns: `${sideBarMinWidth} auto`,
            gridTemplateRows: `${minHeaderHeight} 1fr`,
            gridTemplateAreas: `
            "sidebarlayout-sidebar sidebarlayout-header"
            "sidebarlayout-sidebar sidebarlayout-main"
          `,
          },
          xxl: {
            gridTemplateColumns: `${sideBarMinWidth} 1fr`,
            gridTemplateRows: `${minHeaderHeight} 1fr`,
            gridTemplateAreas: `
            "sidebarlayout-sidebar sidebarlayout-header"
            "sidebarlayout-sidebar sidebarlayout-main"
          `,
          },
        }),
      ],
    },
  ],
  variants: {
    variant: {
      full: [
        style({
          gridTemplateColumns: 'auto',
          gridTemplateRows: `${minHeaderHeight} 1fr`,
          gridTemplateAreas: `
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
      gridTemplateColumns: `${sideBarWidth} auto`,
    },
    xxl: {
      gridTemplateColumns: `${sideBarWidth} minmax(auto, calc(96rem + 377px))`,
    },
  }),
]);

export const bodyWrapperClass = style({
  minHeight: '100dvh',
  backgroundColor: token('color.background.base.default'),
  overflowX: 'hidden',
});

export const mainClass = recipe({
  base: {
    gridArea: 'sidebarlayout-main',
    display: 'flex',
    flex: 1,
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
