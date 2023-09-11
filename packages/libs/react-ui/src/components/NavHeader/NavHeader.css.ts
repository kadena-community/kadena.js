import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    alignItems: 'stretch',
    backgroundColor: '$gray90',
    color: '$gray40',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: '$16',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    position: 'relative',
  }),
  {
    alignItems: 'center',
    selectors: {
      '&:hover': {
        textDecoration: 'none',
      },
      '&:active': {
        color: vars.colors.$negativeContrast,
      },
    },
  },
]);

export const logoClass = style([
  sprinkles({
    display: 'flex',
    marginLeft: '$3',
  }),
  {
    zIndex: 1,
  },
]);

export const navWrapperClass = style([
  sprinkles({
    alignItems: 'stretch',
    display: 'flex',
    justifyContent: 'center',
  }),
]);

export const navListClass = style([
  sprinkles({
    alignItems: 'stretch',
    display: 'flex',
    justifyContent: 'center',
  }),
  {
    listStyle: 'none',
    zIndex: 1,
  },
]);

export const linkClass = style([
  sprinkles({
    alignItems: 'center',
    borderRadius: '$sm',
    color: '$gray40',
    display: 'flex',
    fontSize: '$sm',
    fontWeight: '$semiBold',
    marginRight: '$6',
    marginX: '$1',
    textDecoration: 'none',
  }),
  {
    padding: `${vars.sizes.$1} ${vars.sizes.$2}`,
    transition: 'background 0.1s ease, color 0.1s ease',
  },
  {
    selectors: {
      '&:active': {
        color: vars.colors.$gray90,
        textDecoration: 'none',
      },
      '&:hover': {
        color: vars.colors.$white,
        textDecoration: 'none',
      },
      '&:focus-visible': {
        color: vars.colors.$blue40,
        textDecoration: 'none',
      },
    },
  },
]);

export const activeLinkClass = style([
  sprinkles({
    backgroundColor: '$white',
    color: '$gray90',
  }),
  {
    selectors: {
      '&:hover': {
        color: vars.colors.$gray90,
        textDecoration: 'none',
      },
      '&:focus-visible': {
        background: vars.colors.$blue40,
        color: vars.colors.$gray90,
        textDecoration: 'none',
      },
    },
  },
]);

export const childrenClass = style([
  sprinkles({
    display: 'flex',
    marginLeft: 'auto',
    marginRight: '$3',
  }),
]);

export const glowClass = style([
  {
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    transition: 'all 0.3s ease',
    zIndex: 0,
  },
]);

export const selectContainerClass = style([
  sprinkles({
    alignItems: 'stretch',
    backgroundColor: {
      lightMode: '$gray90',
      darkMode: '$gray90',
    },
    borderRadius: '$sm',
    display: 'flex',
    flexGrow: 1,
    gap: '$2',
    lineHeight: '$lg',
    overflow: 'hidden',
    paddingLeft: '$4',
    paddingRight: '$2',
  }),
  {
    border: `1px solid ${vars.colors.$gray40}`,
  },
]);

export const selectContainerClassDisabled = style([
  sprinkles({
    backgroundColor: {
      lightMode: '$gray20',
    },
    color: {
      lightMode: '$foreground',
    },
  }),
]);

export const selectIconClass = style([
  sprinkles({
    alignItems: 'center',
    display: 'flex',
  }),
]);

export const selectClass = style([
  sprinkles({
    background: 'none',
    border: 'none',
    color: '$gray40',
    flexGrow: 1,
    outline: 'none',
    paddingRight: '$2',
    paddingY: '$2',
    fontSize: '$base',
  }),
  {
    backgroundColor: 'inherit',
  },
]);
