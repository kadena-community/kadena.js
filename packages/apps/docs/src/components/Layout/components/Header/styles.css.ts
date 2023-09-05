import {
  breakpoints,
  darkThemeClass,
  sprinkles,
  vars,
} from '@kadena/react-ui/theme';

import { $$modalZIndex, $$navMenu, $$pageWidth } from '../../global.css';

import { style } from '@vanilla-extract/css';

export const headerButtonClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '$lg',
    cursor: 'pointer',
    color: '$neutral2',
    height: '$11',
    width: '$11',
  }),
  {
    border: 0,
    transition: `opacity 0.2s ease`,
    selectors: {
      [`${darkThemeClass} &`]: {
        color: vars.colors.$neutral5,
      },
      [`${darkThemeClass} &:hover`]: {
        color: vars.colors.$neutral5,
        opacity: '.6',
      },
      [`&:hover`]: {
        color: vars.colors.$neutral2,
        opacity: '.6',
      },
    },
  },
]);

export const iconButtonClass = style([
  sprinkles({
    backgroundColor: 'transparent',
  }),
]);

export const hamburgerButtonClass = style([
  sprinkles({
    backgroundColor: '$neutral4',
  }),
  {
    selectors: {
      '&:hover': {
        backgroundColor: vars.colors.$neutral4,
      },
    },

    '@media': {
      [`screen and ${breakpoints.md}`]: {
        display: 'none',
      },
    },
  },
]);

export const searchButtonClass = style([
  sprinkles({
    backgroundColor: '$neutral4',
  }),
  {
    width: 'inherit',
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: vars.colors.$neutral3,
      },
    },
  },
]);

export const searchButtonSlashClass = style([
  sprinkles({
    borderRadius: '$lg',
    backgroundColor: '$neutral3',
    color: '$white',
  }),
  {
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: vars.colors.$neutral4,
      },
    },
  },
]);

export const headerClass = style([
  sprinkles({
    position: 'sticky',
    top: 0,
    backgroundColor: '$neutral5',
    color: '$white',
  }),
  {
    gridArea: 'header',
    zIndex: $$navMenu,
    selectors: {
      [`${darkThemeClass} &`]: {
        backgroundColor: vars.colors.$neutral2,
      },
    },
  },
]);

export const skipNavClass = style([
  sprinkles({
    position: 'absolute',
    top: '0',
    left: 0,
    paddingY: '$2',
    paddingX: '$4',
    color: '$white',
    fontWeight: '$bold',
    opacity: 0,
  }),
  {
    backgroundColor: 'red',
    transform: 'translateY(-40px)',
    transition: 'transform .1s ease-in, opacity .1s ease-in',
    zIndex: $$modalZIndex,
    selectors: {
      '&:focus': {
        transform: 'translateY(0)',
        opacity: 1,
      },
    },
  },
]);

export const innerWrapperClass = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    paddingY: '$3',
    paddingX: '$4',
    marginY: 0,
    marginX: 'auto',
  }),
  {
    maxWidth: $$pageWidth,
  },
]);

export const spacerClass = style({
  flex: 1,
});

export const socialGroupClass = style([
  sprinkles({
    display: 'flex',
    gap: '$1',
    marginLeft: '$6',
  }),
  {
    display: 'none',
    '@media': {
      [`screen and ${breakpoints.lg}`]: {
        display: 'flex',
      },
    },
  },
]);
