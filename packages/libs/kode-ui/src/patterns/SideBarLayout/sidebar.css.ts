import {
  atoms,
  globalStyle,
  recipe,
  responsiveStyle,
  style,
  token,
} from './../../styles';
import { topbannerHeightCSS } from './aside.css';
import { minHeaderHeight, sideBarMinWidth, sideBarWidth } from './styles.css';

export const menuBackdropClass = recipe({
  base: [
    {
      border: 0,
    },
    responsiveStyle({
      xs: {
        display: 'flex',
        position: 'absolute',
        inset: 0,
        background: token('color.neutral.n90@alpha20'),
        zIndex: token('zIndex.overlay'),
        backdropFilter: 'blur(8px)',
        opacity: 0,
        willChange: 'transform, opacity',
        transition: 'transform .2s ease, opacity 1s ease',
        transform: 'translateX(-100%)',
      },
      md: {
        display: 'none!important',
      },
    }),
  ],
  variants: {
    expanded: {
      true: [
        {
          opacity: 1,
          transform: 'translateX(0%)',
        },
        responsiveStyle({
          md: {
            opacity: 0,
          },
        }),
      ],
      false: [atoms({}), {}],
    },
  },
});

export const menuWrapperClass = recipe({
  base: [
    atoms({
      position: 'fixed',
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
        maxWidth: '300px',
        width: '100dvw',
        display: 'flex',
        willChange: 'transform',
        transition: 'transform .4s ease',
        transform: 'translateX(-100%)',
        gridArea: 'sidebarlayout-main',
        gridRow: '1/5',
        inset: 0,
        zIndex: token('zIndex.overlay'),
        backgroundColor: token('color.background.base.default'),
        padding: token('spacing.lg'),
        paddingBlockStart: `calc(${token('spacing.sm')} + ${topbannerHeightCSS})`,
      },
      md: {
        display: 'flex',
        width: '45px',
        padding: token('spacing.md'),
        paddingBlockStart: `calc(${token('spacing.sm')} + ${topbannerHeightCSS})`,
        paddingInline: token('spacing.xs'),
        gridArea: 'sidebarlayout-sidebar',
        transform: 'translateX(0%)',
        backgroundColor: 'transparent',
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
      width: sideBarWidth,
      paddingInline: token('spacing.md'),
    },
  }),
]);

export const menuMenuIconClass = style({
  gridArea: 'header-toggle',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const menuNavWrapperClass = style([
  atoms({
    marginBlockStart: 'xxxl',
    flex: 1,
  }),
  {
    overflowY: 'hidden',
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
        alignItems: 'center',
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
    width: '100%',
  }),
  {},
]);

export const sidebartreeItemClass = recipe({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: token('spacing.md'),
    borderRadius: token('spacing.sm'),
    textDecoration: 'none',
    fontSize: token('typography.fontSize.sm'),
    fontWeight: token('typography.weight.primaryFont.semiBold'),
    paddingBlock: token('spacing.sm'),
    cursor: 'pointer',

    selectors: {
      '&:hover': {
        backgroundColor: token('color.background.base.@active'),
        color: token('color.text.base.@hover'),
      },
    },
  },
  variants: {
    isExpanded: {
      true: {
        paddingInline: token('spacing.md'),
      },
      false: {
        justifyContent: 'center',
        paddingInline: 0,
      },
    },
    isActive: {
      true: {
        backgroundColor: token('color.background.base.@active'),
        color: token('color.link.base.default'),
      },
      false: {
        color: token('color.text.gray.bolder'),
        selector: {
          '&:hover': {
            color: token('color.text.base.@hover'),
          },
        },
      },
    },
  },
});

globalStyle(`${sidebartreeItemClass()}[data-isactive="true"] svg`, {
  color: token('color.link.base.default'),
  width: '12px',
});
globalStyle(`${sidebartreeItemClass()}[data-isactive="false"] svg`, {
  color: token('color.text.gray.bolder'),
  width: '12px',
});
globalStyle(`${sidebartreeItemClass()}[data-isactive="false"]:hover svg`, {
  color: token('color.text.base.@hover'),
});

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

export const headerWrapperClass = recipe({
  base: [
    {
      maxWidth: '2140px',
      position: 'fixed',
      backgroundColor: token('color.background.base.default'),
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      height: minHeaderHeight,
      gridArea: 'sidebarlayout-header',
      zIndex: token('zIndex.overlay'),
    },
  ],
  variants: {
    sideBarExpanded: {
      true: responsiveStyle({
        xs: {
          paddingInlineStart: token('spacing.md'),
        },
        md: {
          paddingInlineStart: sideBarWidth,
        },
      }),
      false: responsiveStyle({
        xs: {
          paddingInlineStart: token('spacing.md'),
        },
        md: {
          paddingInlineStart: sideBarMinWidth,
        },
      }),
    },
  },
});
export const headerClass = style([
  atoms({
    display: 'grid',
    marginInlineEnd: 'sm',
  }),

  responsiveStyle({
    xs: {
      gridTemplateColumns: `120px 1fr 100px 50px`,
      gridTemplateAreas: `
    "header-logo header-crumbs  header-rightside header-toggle"
  `,
    },
    md: {
      gridTemplateColumns: '1fr 100px',
      gridTemplateRows: '1fr',
      gridTemplateAreas: `
        "header-crumbs header-rightside"
      `,
    },
  }),
]);

export const crumbsWrapperClass = style([
  {
    gridArea: 'header-crumbs',
  },
]);
export const rightsideWrapperClass = style([
  {
    gridArea: 'header-rightside',
    justifyContent: 'flex-end',
  },
]);

globalStyle(`${crumbsWrapperClass} > *`, {
  ...responsiveStyle({
    xs: {
      display: 'none!important',
    },
    sm: {
      display: 'flex!important',
    },
  }),
});

export const headerExpandedClass = style([
  responsiveStyle({
    md: { paddingInlineStart: '50px' },
  }),
]);

export const footerWrapperClass = style([
  atoms({
    justifyContent: 'space-around',
    paddingInline: 'md',
    paddingBlock: 'sm',
  }),
  {
    gridArea: 'sidebarlayout-footer',

    borderBlockStart: token('border.hairline'),
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
