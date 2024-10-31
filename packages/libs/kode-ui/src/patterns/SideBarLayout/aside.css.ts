import { recipe } from '@vanilla-extract/recipes';
import { atoms, responsiveStyle, style, token } from './../../styles';

export const asideWrapperClass = recipe({
  base: [
    {
      gridArea: 'sidebarlayout-aside',
      paddingBlockEnd: token('spacing.md'),
      backgroundColor: token('color.background.base.default'),
    },
    responsiveStyle({
      xs: {
        flex: 1,
        width: '100dvw',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        willChange: 'transform',
        transition: 'transform .4s ease',
        transform: 'translateX(100%)',
        position: 'absolute',
        opacity: 0,
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: token('zIndex.overlay'),
      },
      sm: {
        maxWidth: '370px',
      },
      xl: {
        position: 'absolute',
        transform: 'translateX(0%)',
        marginInlineEnd: token('spacing.md'),
      },
    }),
  ],
  variants: {
    hasTopBanner: {
      false: { gridRow: '1/5' },
      true: { gridRow: '2/5' },
    },
    expanded: {
      true: {
        opacity: 1,
        transform: 'translateX(0%)',
      },
      false: [
        {
          opacity: 0,
        },
      ],
    },
  },
});

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
        transform: 'translateX(100%)',
      },
      xl: {
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
      false: [],
    },
  },
});

export const asideHeaderClass = style([
  atoms({
    backgroundColor: 'base.default',
    paddingBlock: 'sm',
  }),
  {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    minHeight: '50px',
  },
]);
export const asideHeaderCloseButtonWrapperClass = style(
  responsiveStyle({
    xl: {
      display: 'none!important',
    },
  }),
);

export const asideContentClass = style([
  atoms({
    padding: 'sm',
    paddingBlockStart: 'md',

    flex: 1,
  }),
  responsiveStyle({
    xs: {
      backgroundColor: token('color.background.layer.default'),
    },
    xl: {
      border: token('border.hairline'),
      borderRadius: token('spacing.sm'),
      backgroundColor: token('color.background.layer.default'),
    },
  }),
]);
