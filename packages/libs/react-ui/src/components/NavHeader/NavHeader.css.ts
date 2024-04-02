import { style } from '@vanilla-extract/css';
import { atoms, tokens } from '../../styles';
import { token } from '../../styles/themeUtils';
import { iconFill } from '../Icon/IconWrapper.css';

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
    fontWeight: 'primaryFont.medium',
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

export const selectContainerClass = style([
  {
    border: `1px solid ${token('color.neutral.n60')}`,
  },
]);
