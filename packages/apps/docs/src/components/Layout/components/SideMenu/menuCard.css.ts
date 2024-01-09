import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import { style, styleVariants } from '@vanilla-extract/css';

export const menuCardClass = style([
  sprinkles({
    position: 'absolute',
    width: '100%',
    height: '100%',
  }),
  {
    paddingInline: vars.sizes.$6,
    transition: 'transform .2s ease',
    ...responsiveStyle({ md: { overflowY: 'auto' } }),

    selectors: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  },
]);

export const menuCardAnimateL2RVariant: Record<string, string> = styleVariants({
  true: {
    transform: 'translateX(-100%)',
  },
  false: {
    transform: 'translateX(100%)',
  },
});

export const menuCardActiveVariant: Record<string, string> = styleVariants({
  true: {
    transform: 'translateX(0)',
  },
  false: {},
});
