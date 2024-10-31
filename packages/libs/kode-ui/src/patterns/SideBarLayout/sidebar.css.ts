import {
  atoms,
  globalStyle,
  recipe,
  responsiveStyle,
  style,
  token,
} from './../../styles';
import { minHeaderHeight } from './styles.css';

export const menuBackdropClass = recipe({
  base: [
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
        transition: 'transform .4s ease, opacity 1s ease',
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
      ],
      false: [atoms({}), {}],
    },
  },
});

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
        maxWidth: '300px',
        width: '100dvw',
        display: 'flex',
        willChange: 'transform',
        transition: 'transform .4s ease',
        transform: 'translateX(-100%)',
        position: 'relative',
        gridArea: 'sidebarlayout-main',
        gridRow: '1/5',
        inset: 0,
        zIndex: token('zIndex.overlay'),
        backgroundColor: token('color.background.layer.default'),
        padding: token('spacing.lg'),
      },
      md: {
        display: 'flex',
        width: '45px',
        padding: token('spacing.md'),
        paddingBlockStart: '0',
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

globalStyle(`${listItemClass} button`, {
  justifyContent: 'flex-start',
  flex: 1,
});
globalStyle(`${listItemClass} a`, { justifyContent: 'flex-start', flex: 1 });

export const headerWrapperClass = style([
  {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    height: minHeaderHeight,
    gridArea: 'sidebarlayout-header',
  },
]);
export const headerClass = style([
  atoms({
    display: 'grid',
  }),

  responsiveStyle({
    xs: {
      gridTemplateColumns: `50px 1fr 50px`,
      gridTemplateAreas: `
    "header-logo header-crumbs header-toggle"
  `,
    },
    md: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto',
      gridTemplateAreas: `
    "header-crumbs"
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
