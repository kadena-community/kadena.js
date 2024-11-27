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
  ],
  compoundVariants: [
    {
      variants: {
        isLeftExpanded: false,
        isRightExpanded: false,
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
    {
      variants: {
        isLeftExpanded: true,
        isRightExpanded: false,
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
            gridTemplateColumns: `${sideBarWidth} auto`,
            gridTemplateRows: `${minHeaderHeight} 1fr`,
            gridTemplateAreas: `
            "sidebarlayout-sidebar sidebarlayout-header"
            "sidebarlayout-sidebar sidebarlayout-main"
          `,
          },
          xxl: {
            gridTemplateColumns: `${sideBarWidth} minmax(auto, calc(96rem + 377px))`,
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
        isLeftExpanded: false,
        isRightExpanded: true,
      },
      style: [
        responsiveStyle({
          xs: {
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
            gridTemplateColumns: `${sideBarMinWidth} auto calc(${rightAsBarMinWidth} + 20px)`,

            gridTemplateRows: `${minHeaderHeight} 1fr`,
            gridTemplateAreas: `
            "sidebarlayout-sidebar sidebarlayout-header sidebarlayout-header"
            "sidebarlayout-sidebar sidebarlayout-main ."
          `,
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
            gridTemplateColumns: `${sideBarWidth} auto`,
            gridTemplateRows: `${minHeaderHeight} 1fr`,
            gridTemplateAreas: `
            "sidebarlayout-sidebar sidebarlayout-header"
            "sidebarlayout-sidebar sidebarlayout-main"
          `,
          },
          xxl: {
            gridTemplateColumns: `${sideBarWidth} minmax(auto, calc(96rem + 377px)) calc(${rightAsBarMinWidth} + 20px)`,
            gridTemplateRows: `${minHeaderHeight} 1fr`,
            gridTemplateAreas: `
            "sidebarlayout-sidebar sidebarlayout-header  sidebarlayout-header"
            "sidebarlayout-sidebar sidebarlayout-main ."
          `,
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
