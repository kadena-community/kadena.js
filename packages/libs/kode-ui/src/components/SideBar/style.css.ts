import { globalStyle } from '@vanilla-extract/css';
import { atoms, recipe, responsiveStyle, style, token } from './../../styles';

export const menuWrapperClass = recipe({
  base: [
    atoms({
      flexDirection: 'column',
      flex: 1,
    }),
    {
      backgroundColor: 'red',

      height: '100%',
    },
    responsiveStyle({
      xs: {
        height: 'calc(100dvh - 60px)',
        width: '100dvw',
        display: 'flex',
        willChange: 'transform',
        transition: 'transform .4s ease',
        transform: 'translateX(-100%)',
        position: 'fixed',
        gridArea: 'auto',
        inset: 0,
        top: '60px',
        zIndex: token('zIndex.overlay'),
      },
      md: {
        display: 'flex',
        width: '50px',
        padding: 'md',
        paddingInline: 'xs',
        gridArea: 'sidebarlayout-sidebar',
        transform: 'translateX(0%)',
      },
    }),
  ],
  variants: {
    expanded: {
      true: [atoms({}), {}],
      false: [atoms({}), {}],
    },
  },
});

export const menuWrapperMobileExpandedClass = style([
  responsiveStyle({
    xs: {
      transform: 'translateX(0%)',
    },
    md: {
      width: '200px',
      paddingInline: 'md',
    },
  }),
]);

export const menuMenuIconClass = style({
  gridArea: 'header-toggle',
});

export const menuNavWrapperClass = style([
  atoms({
    flex: 1,
  }),
  {
    overflowY: 'scroll',
    background: 'yellow',
  },
]);

export const menuLogoClass = style({
  position: 'absolute',
});

export const listClass = recipe({
  base: [
    atoms({
      display: 'flex',
      padding: 'no',
      margin: 'no',
      gap: 'sm',
      width: '100%',
    }),
    {
      listStyle: 'none',
    },
  ],
  variants: {
    expanded: {
      true: {},
      false: {},
    },
    direction: {
      horizontal: {
        flexDirection: 'row',
      },
      vertical: {
        flexDirection: 'column',
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        direction: 'horizontal',
        expanded: false,
      },
      style: {
        flexDirection: 'row',
      },
    },
  ],
});

export const listItemClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  }),
  {},
]);
export const listItemInlineClass = style([
  atoms({
    display: 'flex',
  }),
  {
    width: '100%',
  },
]);

export const listNotExpandedClass = style([
  {},
  responsiveStyle({
    md: {
      flexDirection: 'column',
    },
  }),
]);

globalStyle(`${listItemClass} > *`, {
  flex: 1,
  width: '100%',
  display: 'flex',
});
globalStyle(`${listItemClass} button`, { flex: 1 });

export const headerWrapperClass = style([
  {
    gridArea: 'sidebarlayout-header',
    background: 'purple',
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
      gridTemplateColumns: '50px auto 50px',
      gridTemplateRows: 'auto',
      gridTemplateAreas: `
    "header-logo header-toggle header-crumbs"
  `,
    },
  }),
]);
export const headerClass = style([
  atoms({
    position: 'fixed',
    display: 'grid',
  }),

  responsiveStyle({
    xs: {
      gridTemplateColumns: '50px auto 50px',
      gridTemplateAreas: `
    "header-logo header-crumbs header-toggle"
  `,
    },
    md: {
      gridTemplateColumns: '150px 50px auto',
      gridTemplateAreas: `
    "header-logo header-toggle header-crumbs"
  `,
    },
  }),
]);

export const headerExpandedClass = style([
  responsiveStyle({
    md: {
      gridTemplateColumns: '50px 50px auto',
    },
  }),
]);

export const footerWrapperClass = style([
  {
    gridArea: 'sidebarlayout-footer',
  },
  responsiveStyle({
    xs: {
      display: 'flex',
    },
    md: {
      display: 'none',
    },
  }),
]);
