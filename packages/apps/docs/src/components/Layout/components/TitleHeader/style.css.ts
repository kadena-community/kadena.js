import { breakpoints, sprinkles, vars } from '@kadena/react-ui/theme';

import { $$backgroundOverlayColor, $$pageWidth } from '../../global.css';

import { style } from '@vanilla-extract/css';

export const headerWrapperClass = style([
  sprinkles({
    position: 'relative',
    display: 'grid',
  }),
  {
    gridArea: 'pageheader',
    height: `calc(${vars.sizes.$64} + ${vars.sizes.$10})`,
    gridTemplateRows: `${vars.sizes.$64} ${vars.sizes.$10}`,
    gridTemplateAreas: `
    "main"
    "shadow"
    `,
    zIndex: 99,

    selectors: {
      '&::before': {
        content: '',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: vars.sizes.$10,
        backgroundColor: vars.colors.$background,
      },
      '&::after': {
        content: '',
        position: 'absolute',
        inset: 0,
        background: 'url("/assets/bg-horizontal.png")',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'center',
        backgroundPositionY: '95%',
        transform: 'scaleY(.3) translateY(-100%)',
        opacity: 0,

        transition: 'transform 1s ease, opacity 2s  ease-out',
        transitionDelay: '600ms',

        '@media': {
          [`screen and ${breakpoints.md}`]: {},
        },
      },
    },

    '@media': {
      [`screen and ${breakpoints.md}`]: {
        zIndex: 101,
      },
    },
  },
]);

export const headerLoadedClass = style({
  selectors: {
    '&::after': {
      transform: 'scaleY(1) translateY(0) ',
      opacity: 1,
    },
  },
});

export const headerClass = style([
  sprinkles({
    position: 'relative',
  }),
  {
    gridArea: 'main',
    zIndex: 3,
    backgroundColor: $$backgroundOverlayColor,
  },
]);

export const wrapperClass = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginX: 'auto',
    marginTop: 0,
    marginBottom: '$6',
    paddingBottom: '$10',
    paddingTop: '$20',
    paddingX: '$4',
  }),
  {
    maxWidth: $$pageWidth,
  },
]);

export const subheaderClass = style([
  sprinkles({
    color: '$neutral4',
    textAlign: 'center',
  }),
]);

export const avatarClass = style({
  borderRadius: '50%',
});
