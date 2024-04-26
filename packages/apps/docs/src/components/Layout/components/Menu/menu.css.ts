import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/styles';
import { style, styleVariants } from '@vanilla-extract/css';
import { $$leftSideWidth, $$sideMenu } from '../../global.css';

export const menuClass = style([
  atoms({
    position: 'fixed',
    height: '100%',
    width: '100%',
    bottom: 0,
    paddingBlockEnd: 'md',
  }),
  {
    backgroundColor: tokens.kda.foundation.color.neutral.n0,
    top: tokens.kda.foundation.size.n16,
    overflow: 'hidden',
    height: `calc(100vh - ${tokens.kda.foundation.size.n13})`,
    gridArea: 'menu',
    gridRow: '2 / span 3',
    zIndex: $$sideMenu,
    borderRight: '1px solid $borderColor',
    transform: 'translateX(-100%)',
    transition: 'transform .3s ease, width .3s ease',
    ...responsiveStyle({
      sm: {
        width: $$leftSideWidth,
      },
      lg: {
        position: 'sticky',
        top: tokens.kda.foundation.size.n18,
        bottom: 'auto',
        height: `calc(100vh - ${tokens.kda.foundation.size.n18})`,
        transform: 'translateX(0)',
        backgroundColor: 'transparent',
        paddingBlockEnd: tokens.kda.foundation.size.n40,
      },
    }),
  },
]);

export const menuOpenVariants = styleVariants({
  isOpen: { transform: 'translateX(0)' },
  isClosed: {
    transform: 'translateX(-100%)',

    ...responsiveStyle({ md: { transform: 'translateX(0)' } }),
  },
});

export const menuInLayoutVariants = styleVariants({
  true: [
    atoms({
      display: 'block',
    }),
  ],
  false: [
    atoms({
      display: {
        xs: 'block',
        lg: 'none',
      },
    }),
  ],
});

export const menuLayoutVariants = styleVariants({
  landing: {},
  normal: {},
});

export const menuBackClass = style([
  atoms({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    cursor: 'pointer',
  }),
  {
    backgroundColor: 'rgba(0,0,0,.5)',
    border: 0,
    opacity: 0,
    transform: 'translateX(-100%)',
    transition: 'opacity .5s ease, transform .1s ease',
    zIndex: `calc(${$$sideMenu} - 1)`,

    ...responsiveStyle({ lg: { opacity: 0, pointerEvents: 'none' } }),
  },
]);

export const menuBackOpenVariants = styleVariants({
  isOpen: {
    transform: 'translateX(0)',
    opacity: 1,

    ...responsiveStyle({ lg: { transform: 'translateX(-100%)', opacity: 0 } }),
  },
  isClosed: {
    transform: 'translateX(-100%)',
    pointerEvents: 'none',
    opacity: 0,
  },
});
