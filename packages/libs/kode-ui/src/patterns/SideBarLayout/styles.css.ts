import { atoms, recipe, responsiveStyle, style, token } from './../../styles';

export const minHeaderHeight = '60px';
export const sideBarWidth = '232px';
export const sideBarMinWidth = '45px';
export const rightAsBarMinWidth = '370px';

export const layoutWrapperClass = recipe({
  base: [
    atoms({ width: '100%', display: 'grid', flex: 1 }),
    {
      minHeight: '100%',
    },

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
        gridTemplateRows: `${minHeaderHeight} 1fr`,
        gridTemplateAreas: `
        "sidebarlayout-sidebar sidebarlayout-header"
        "sidebarlayout-sidebar sidebarlayout-main"
      `,
      },
      xxl: {
        gridTemplateRows: `${minHeaderHeight} 1fr`,
        gridTemplateAreas: `
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
            gridTemplateColumns: `${sideBarMinWidth} 1fr`,
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
            gridTemplateColumns: `${sideBarWidth} minmax(auto, calc(96rem + 377px))`,
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
            gridTemplateColumns: `${sideBarWidth} minmax(auto, calc(96rem + 377px)) calc(${rightAsBarMinWidth} + 20px)`,
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
  overflowX: 'hidden',
});

export const mainClass = style({
  gridArea: 'sidebarlayout-main',
});
