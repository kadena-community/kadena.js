import { atoms, recipe, responsiveStyle, style, token } from './../../styles';

export const minHeaderHeight = '60px';
export const sideBarWidth = '232px';

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
            gridTemplateColumns: '45px auto',
            gridTemplateRows: `${minHeaderHeight} 1fr`,
            gridTemplateAreas: `
            "sidebarlayout-sidebar sidebarlayout-header"
            "sidebarlayout-sidebar sidebarlayout-main"
          `,
          },
          xl: {
            gridTemplateColumns: '45px 800px 1fr',
            gridTemplateRows: `${minHeaderHeight} 1fr`,
            gridTemplateAreas: `
            "sidebarlayout-sidebar sidebarlayout-header sidebarlayout-header"
            "sidebarlayout-sidebar sidebarlayout-main  sidebarlayout-aside"
          `,
          },
        }),
      ],
    },
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
            gridTemplateColumns: '45px auto',
            gridTemplateRows: `${minHeaderHeight} 1fr`,
            gridTemplateAreas: `
            "sidebarlayout-sidebar sidebarlayout-header sidebarlayout-header"
            "sidebarlayout-sidebar sidebarlayout-main sidebarlayout-aside"
          `,
          },
          xl: {
            position: 'relative',
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
    xl: {
      gridTemplateColumns: `${sideBarWidth} 800px 1fr`,
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
