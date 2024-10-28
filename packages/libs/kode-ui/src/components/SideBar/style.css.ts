import { globalStyle } from '@vanilla-extract/css';
import { atoms, recipe, responsiveStyle, style } from './../../styles';

export const menuWrapperClass = recipe({
  base: [
    atoms({
      position: 'relative',

      flexDirection: 'column',
      flex: 1,
    }),
    {
      gridArea: 'sidebarlayout-sidebar',
      height: '100%',
    },
    responsiveStyle({
      xs: {
        display: 'none',
      },
      md: {
        display: 'flex',
      },
    }),
  ],
  variants: {
    expanded: {
      true: [
        atoms({
          padding: 'md',
        }),
        {
          width: '200px',
        },
      ],
      false: [
        atoms({
          paddingInline: 'xs',
        }),
        {
          width: '40px',
        },
      ],
    },
  },
});

export const menuMenuIconClass = recipe({
  base: {
    transition: 'all .2s ease',
    transform: 'translateX(0px)',
  },
  variants: {
    expanded: {
      true: {},
      false: {
        transform: 'translateX(50px)',
      },
    },
  },
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
        flexDirection: 'column',
      },
    },
  ],
});

export const listItemClass = style([
  atoms({
    display: 'flex',
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

globalStyle(`${listItemClass} > *`, { flex: 1 });

export const headerWrapperClass = style({
  gridArea: 'sidebarlayout-header',
});
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
