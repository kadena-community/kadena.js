import { responsiveStyle, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';
import {
  $$backgroundOverlayColor,
  $$pageWidth,
  globalClass,
} from '../../global.css';

export const headerWrapperClass = style([
  globalClass,
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
        background: 'url("/assets/bg-horizontal.webp")',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'center',
        backgroundPositionY: '95%',
        transform: 'scaleY(.3) translateY(-100%)',
        opacity: 0,

        transition: 'transform 1s ease, opacity 2s  ease-out',
        transitionDelay: '600ms',
      },
    },

    ...responsiveStyle({ md: { zIndex: 101 } }),
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
  }),
  {
    marginInline: 'auto',
    marginBlockStart: 0,
    marginBlockEnd: vars.sizes.$6,
    paddingBlockEnd: vars.sizes.$10,
    paddingBlockStart: vars.sizes.$20,
    paddingInline: vars.sizes.$4,
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
