import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import { style, styleVariants } from '@vanilla-extract/css';
import { $$leftSideWidth, $$sideMenu } from '../../global.css';

export const menuClass = style([
  sprinkles({
    position: 'fixed',
    height: '100%',
    width: '100%',
    backgroundColor: '$background',
    overflow: 'hidden',
    top: '$17',
    bottom: 0,
  }),
  {
    paddingBlockEnd: vars.sizes.$4,
    height: `calc(100vh - ${vars.sizes.$13})`,
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
      md: {
        position: 'sticky',
        top: vars.sizes.$18,
        bottom: 'auto',
        height: `calc(100vh - ${vars.sizes.$18})`,
        transform: 'translateX(0)',
        backgroundColor: 'transparent',
        paddingBlockEnd: vars.sizes.$40,
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
    sprinkles({
      display: 'block',
    }),
  ],
  false: [
    sprinkles({
      display: {
        xs: 'block',
        md: 'none',
      },
    }),
  ],
});

export const menuLayoutVariants = styleVariants({
  landing: {},
  normal: {},
});

export const menuBackClass = style([
  sprinkles({
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

    ...responsiveStyle({ md: { opacity: 0, pointerEvents: 'none' } }),
  },
]);

export const menuBackOpenVariants = styleVariants({
  isOpen: {
    transform: 'translateX(0)',
    opacity: 1,

    ...responsiveStyle({ md: { transform: 'translateX(-100%)', opacity: 0 } }),
  },
  isClosed: {
    transform: 'translateX(-100%)',
    pointerEvents: 'none',
    opacity: 0,
  },
});
