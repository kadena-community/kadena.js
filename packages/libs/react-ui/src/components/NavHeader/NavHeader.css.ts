import { iconFill } from '@components/Icon/IconWrapper.css';
import { token } from '@theme/themeUtils';
import { style } from '@vanilla-extract/css';
import { atoms, tokens, vars } from '../../styles';

export const containerClass = style([
  atoms({
    width: '100%',
  }),
  {
    height: tokens.kda.foundation.size.n16,
    backgroundColor: tokens.kda.foundation.color.neutral.n1,
  },
]);

export const contentClass = style([
  atoms({
    position: 'relative',
    paddingInline: 'sm',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginInline: 'auto',
    height: '100%',
  }),
]);

export const itemsContainerClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flex: 1,
    alignItems: 'center',
    height: '100%',
    gap: 'md',
    overflowX: 'auto',
    paddingInline: 'md',
    marginInlineStart: 'auto',
  }),
]);

export const logoClass = style([
  atoms({
    marginInlineEnd: 'md',
    marginBlock: 'sm',
    padding: 'xs',
    borderRadius: 'sm',
    flexShrink: 0,
  }),
  {
    selectors: {
      '&:focus-visible': {
        outline: `${token('border.width.normal')} solid ${token(
          'color.border.brand.primary.@focus',
        )}`,
      },
    },
  },
]);

export const navListClass = style([
  atoms({
    alignItems: 'stretch',
    display: 'flex',
    gap: 'sm',
    flex: 1,
    paddingInline: 'no',
  }),
  {
    listStyle: 'none',
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
    borderRadius: 'sm',
    paddingInline: 'sm',
    paddingBlock: 'xs',
    whiteSpace: 'nowrap',
  }),
  {
    color: token('color.neutral.n70'),
    transition: 'background 0.1s ease, color 0.1s ease',
  },
  {
    selectors: {
      '&:hover': {
        color: token('color.neutral.n100'),
        textDecoration: 'none',
      },
      '&:focus-visible': {
        color: token('color.neutral.n100'),
        outline: `${token('border.width.normal')} solid ${token(
          'color.border.brand.primary.@focus',
        )}`,
        textDecoration: 'none',
      },
      "&[data-state='active']": {
        backgroundColor: token('color.neutral.n100'),
        color: token('color.neutral.n1'),
      },
    },
  },
]);

export const iconButtonClass = style([
  {
    background: 'none !important',
    vars: {
      [iconFill]: `${token('color.neutral.n70')} !important`,
    },
    selectors: {
      '&:hover, &:focus-visible': {
        background: 'none',
        vars: {
          [iconFill]: `${token('color.neutral.n100')} !important`,
        },
      },
    },
  },
]);

// TODO review
export const selectContainerClass = style([
  atoms({
    alignItems: 'stretch',
    display: 'flex',
    lineHeight: 'lg',
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
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
