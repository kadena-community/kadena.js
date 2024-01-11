import { style } from '@vanilla-extract/css';
import { atoms, vars } from '../../styles';

export const containerClass = style([
  atoms({
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    position: 'relative',
  }),
  {
    height: vars.sizes.$16,
    backgroundColor: vars.colors.$gray90,
    color: vars.colors.$gray40,
  },
]);

export const itemsContainerClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflowX: 'auto',
  }),
  {
    paddingLeft: vars.sizes.$3,
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
  atoms({
    display: 'flex',
    paddingInline: 'md',
    paddingBlock: 'sm',
  }),
]);

export const navWrapperClass = style([
  atoms({
    alignItems: 'stretch',
    display: 'flex',
    justifyContent: 'center',
  }),
]);

export const navListClass = style([
  atoms({
    alignItems: 'stretch',
    display: 'flex',
    justifyContent: 'center',
  }),
  {
    listStyle: 'none',
    paddingInlineStart: '1rem',
    zIndex: 1,
  },
]);

export const linkClass = style([
  atoms({
    alignItems: 'center',
    display: 'flex',
    fontSize: 'sm',
    fontWeight: 'bodyFont.black',
    textDecoration: 'none',
  }),
  {
    borderRadius: '1px',
    color: vars.colors.$gray40,
    marginRight: vars.sizes.$6,
    margin: `0 ${vars.sizes.$1}`,
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
  {
    backgroundColor: vars.colors.$white,
    color: vars.colors.$gray90,
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
  atoms({
    display: 'flex',
  }),
  {
    marginRight: vars.sizes.$3,
  },
]);

export const glowClass = style([
  {
    top: 0,
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 0,
  },
]);

export const selectContainerClass = style([
  atoms({
    alignItems: 'stretch',
    display: 'flex',
    flexGrow: 1,
    lineHeight: 'lg',
    overflow: 'hidden',
    position: 'relative',
  }),
  {
    paddingLeft: vars.sizes.$4,
    paddingRight: vars.sizes.$2,
    backgroundColor: vars.colors.$gray90,
    borderRadius: '1px',
    border: `1px solid ${vars.colors.$gray40}`,
    selectors: {
      '&:active': {
        color: vars.colors.$gray40,
      },
    },
  },
]);

export const selectContainerClassDisabled = style([
  {
    backgroundColor: vars.colors.$gray20,
    color: vars.colors.$gray100,
  },
]);

export const selectIconClass = style([
  atoms({
    alignItems: 'center',
    display: 'flex',
  }),
  {
    color: vars.colors.$gray40,
    selectors: {
      '&:active': {
        color: vars.colors.$gray40,
      },
    },
  },
]);

export const selectClass = style([
  atoms({
    background: 'none',
    border: 'none',
    flexGrow: 1,
    outline: 'none',
    fontSize: 'base',
  }),
  {
    backgroundColor: 'inherit',
    color: vars.colors.$gray40,
    appearance: 'none',
    padding: `${vars.sizes.$2} 0`,
    paddingRight: vars.sizes.$8,
    paddingLeft: vars.sizes.$3,
  },
]);

export const chevronIconClass = style([
  atoms({
    position: 'absolute',
    display: 'inline-flex',
    alignItems: 'center',
    top: 0,
    bottom: 0,
  }),
  {
    right: vars.sizes.$1,
    color: vars.colors.$gray40,
    marginRight: vars.sizes.$2,
    pointerEvents: 'none',
    zIndex: 10,
    selectors: {
      '&:active': {
        color: vars.colors.$gray40,
      },
    },
  },
]);
