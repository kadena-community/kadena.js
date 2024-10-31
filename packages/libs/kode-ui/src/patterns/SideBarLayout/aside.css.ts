import { recipe } from '@vanilla-extract/recipes';
import { responsiveStyle, token } from './../../styles';

export const asideWrapperClass = recipe({
  base: [
    {
      gridArea: 'sidebarlayout-aside',
      gridRow: '1/5',
      //   gridArea: 'sidebarlayout-aside',
      //   background: 'purple',
      //   display: 'flex',
      //   position: 'absolute',
      //   width: '300px',
      //   top: 0,
      //   bottom: 0,
      //   right: 0,
      //   zIndex: token('zIndex.overlay'),
      //   willChange: 'transform, opacity',
      //   transition: 'transform .4s ease, opacity 1s ease',
      //   transform: 'translateX(0%)',
    },
    responsiveStyle({
      xs: {
        flex: 1,
        maxWidth: '300px',
        width: '100dvw',
        display: 'flex',
        willChange: 'transform',
        transition: 'transform .4s ease',
        transform: 'translateX(100%)',
        position: 'absolute',

        top: 0,
        bottom: 0,
        right: 0,
        zIndex: token('zIndex.overlay'),
        backgroundColor: token('color.background.layer.default'),
        padding: token('spacing.lg'),
      },
      xl: {
        position: 'initial',
        transform: 'translateX(0%)',
      },
    }),
  ],
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
