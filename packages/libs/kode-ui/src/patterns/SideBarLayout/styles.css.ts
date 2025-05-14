import { atoms, recipe, responsiveStyle, style, token } from './../../styles';

export const minHeaderHeight = '60px';
export const sideBarWidth = '232px';
export const sideBarMinWidth = '45px';
export const rightAsBarMinWidth = '370px';
export const mainFullWidth = '96rem';

export const layoutWrapperClass = recipe({
  base: [
    atoms({ width: '100%', display: 'grid', flex: 1 }),
    {
      minHeight: '100%',
    },

    responsiveStyle({
      xs: {
        gridTemplateColumns: 'auto',
        gridTemplateRows: `min-content ${minHeaderHeight} 1fr 60px`,
        gridTemplateAreas: `
        "sidebarlayout-topbanner"
        "sidebarlayout-header"
        "sidebarlayout-main"
        "sidebarlayout-footer"
      `,
      },
      md: {
        gridTemplateRows: `min-content ${minHeaderHeight} 1fr`,
        gridTemplateAreas: `
        "sidebarlayout-sidebar sidebarlayout-topbanner"
        "sidebarlayout-sidebar sidebarlayout-header"
        "sidebarlayout-sidebar sidebarlayout-main"
      `,
      },
      xxl: {
        gridTemplateRows: `min-content ${minHeaderHeight} 1fr`,
        gridTemplateAreas: `
        "sidebarlayout-sidebar sidebarlayout-topbanner"
        "sidebarlayout-sidebar sidebarlayout-header"
        "sidebarlayout-sidebar sidebarlayout-main"
      `,
      },
    }),
  ],
  compoundVariants: [
    {
      variants: {
        isLeftExpanded: false,
        isRightExpanded: false,
      },
      style: [
        responsiveStyle({
          md: {
            gridTemplateColumns: `${sideBarMinWidth} auto`,
          },
          xxl: {
            gridTemplateColumns: `${sideBarMinWidth} minmax(auto calc(${mainFullWidth} + ${sideBarWidth} - ${sideBarMinWidth} + ${rightAsBarMinWidth}))`,
          },
        }),
      ],
    },
    {
      variants: {
        isLeftExpanded: true,
        isRightExpanded: false,
      },
      style: [
        responsiveStyle({
          md: {
            gridTemplateColumns: `${sideBarWidth} auto`,
          },
          xxl: {
            gridTemplateColumns: `${sideBarWidth} minmax(auto, calc(${mainFullWidth} + ${rightAsBarMinWidth}))`,
          },
        }),
      ],
    },

    {
      variants: {
        isLeftExpanded: false,
        isRightExpanded: true,
      },
      style: [
        responsiveStyle({
          md: {
            gridTemplateColumns: `${sideBarMinWidth} auto`,
          },
          xxl: {
            gridTemplateColumns: `${sideBarMinWidth} auto calc(${rightAsBarMinWidth} + 20px)`,
          },
        }),
      ],
    },

    {
      variants: {
        isLeftExpanded: true,
        isRightExpanded: true,
      },
      style: [
        responsiveStyle({
          md: {
            gridTemplateColumns: `${sideBarWidth} auto`,
          },
          xxl: {
            gridTemplateColumns: `${sideBarWidth} minmax(auto, calc(${mainFullWidth} + ${sideBarWidth})) calc(${rightAsBarMinWidth} + 20px)`,
          },
        }),
      ],
    },
  ],
  variants: {
    isLeftExpanded: {
      false: {},
      true: {},
    },
    isRightExpanded: {
      true: {},
      false: {},
    },
  },
});

export const bodyWrapperClass = style({
  minHeight: '100dvh',

  backgroundColor: token('color.background.base.default'),
});

export const mainClass = style({
  gridArea: 'sidebarlayout-main',
  position: 'relative',
});

export const topbannerWrapperClass = style({
  gridArea: 'sidebarlayout-topbanner',
  position: 'fixed',
  zIndex: token('zIndex.overlay'),
  width: '100%',
});
