import { recipe } from '@vanilla-extract/recipes';
import { atoms, responsiveStyle, style, token } from './../../styles';

export const asideWrapperClass = recipe({
  base: [
    {
      gridArea: 'sidebarlayout-aside',
      gridRow: '1/5',
      marginInlineEnd: token('spacing.md'),
    },
    responsiveStyle({
      xs: {
        flex: 1,
        maxWidth: '300px',
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
      xl: {
        position: 'initial',
        opacity: 1,
        transform: 'translateX(0%)',
      },
    }),
  ],
  variants: {
    expanded: {
      true: {
        opacity: 1,
        transform: 'translateX(0%)',
      },
      false: [responsiveStyle({})],
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
      lg: {
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
    border: 'hairline',
    borderRadius: 'sm',
    flex: 1,

    backgroundColor: 'layer.default',
  }),
]);
