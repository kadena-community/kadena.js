import { atoms, recipe, responsiveStyle, style, token } from './../../styles';

export const menuWrapperClass = recipe({
  base: [
    atoms({
      flexDirection: 'column',
      flex: 1,
      gap: 'sm',
    }),
    {
      height: '100%',
    },
    responsiveStyle({
      xs: {
        flex: 1,
        width: '100dvw',
        display: 'flex',
        willChange: 'transform',
        transition: 'transform .4s ease',
        transform: 'translateX(-100%)',
        position: 'relative',
        gridArea: 'sidebarlayout-main',
        gridRow: '2/4',
        inset: 0,
        zIndex: token('zIndex.overlay'),
      },
      md: {
        display: 'flex',
        width: '50px',
        padding: token('spacing.md'),
        paddingInline: token('spacing.xs'),
        gridArea: 'sidebarlayout-sidebar',
        gridRow: '2/3',
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
      paddingInline: token('spacing.md'),
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

// globalStyle(`${listItemClass} > *`, {
//   flex: 1,
//   width: '100%',
//   display: 'flex',
// });
// globalStyle(`${listItemClass} button`, { flex: 1 });
// globalStyle(`${listItemClass} a`, { flex: 1 });

export const headerWrapperClass = style([
  {
    display: 'flex',
    position: 'absolute',
    width: '100%',
    height: '60px',
    gridArea: 'sidebarlayout-header',
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
  atoms({
    justifyContent: 'space-around',
    paddingInline: 'md',
    paddingBlock: 'sm',
    borderStyle: 'solid',
    borderColor: 'base.subtle',
  }),
  {
    gridArea: 'sidebarlayout-footer',
    borderWidth: 0,
    borderBlockStartWidth: token('border.hairline'),
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
