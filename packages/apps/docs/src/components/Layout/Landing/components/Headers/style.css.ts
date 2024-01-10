import {
  $$backgroundOverlayColor,
  $$pageWidth,
} from '@/components/Layout/global.css';
import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const headerClass = style([
  sprinkles({
    position: 'relative',
    margin: 0,
    padding: 0,
  }),
  {
    maxWidth: '100vw',
    gridArea: 'pageheader',
    zIndex: 2,
    selectors: {
      '&::before': {
        content: '',
        position: 'absolute',
        inset: 0,
        bottom: `calc(0px - ${vars.sizes.$5})`,
        background: 'url("/assets/bg-horizontal.webp")',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'center',
        backgroundPositionY: '0%',
        transform: 'scale(-1, -0.3) translate(0, 100%)',
        opacity: 0,

        transition: 'transform 1s ease, opacity 2s  ease-out',
        transitionDelay: '600ms',
      },
    },
  },
]);

export const headerLoadedClass = style({
  selectors: {
    '&::before': {
      transform: 'scale(-1, -1.5) translate(0, 70px)',
      opacity: 1,
    },
  },
});

export const wrapperClass = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  }),
  {
    paddingInline: vars.sizes.$10,
    paddingBlockStart: vars.sizes.$20,
    paddingBlockEnd: vars.sizes.$20,
    marginInline: 'auto',
    marginBlockEnd: vars.sizes.$16,
    maxWidth: $$pageWidth,
    backgroundColor: $$backgroundOverlayColor,
    boxSizing: 'border-box',
  },
]);

export const subheaderClass = style([
  sprinkles({
    color: '$neutral4',
    fontSize: '$xl',
  }),
  {
    selectors: {
      [`${darkThemeClass} &`]: {
        color: vars.colors.$neutral4,
      },
    },
  },
]);

export const searchInputWrapper = style({
  maxWidth: `calc(3 * ${vars.sizes.$40})`,
});
