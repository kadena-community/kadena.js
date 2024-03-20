import { style } from '@vanilla-extract/css';
import { atoms } from '../../styles/atoms.css';
import { tokens } from '../../styles/tokens/contract.css';

export const tabsContainerClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  }),
]);

export const tabListWrapperClass = style([
  atoms({
    overflowX: 'auto',
  }),
  {
    maxWidth: '100%',
    paddingLeft: '2px',
    paddingTop: '2px', // For focus ring
  },
]);

export const tabListClass = style([
  atoms({
    display: 'inline-flex',
    flexDirection: 'row',
    position: 'relative',
  }),
  {
    minWidth: '100%',
    selectors: {
      '&::before': {
        position: 'absolute',
        display: 'block',
        content: '',
        bottom: '0',
        left: '0',
        right: '0',
        height: tokens.kda.foundation.border.width.normal,
        backgroundColor: tokens.kda.foundation.color.border.base.default,
      },
    },
  },
]);

export const tabItemClass = style([
  atoms({
    border: 'none',
    cursor: 'pointer',
    paddingBlock: 'xs',
    paddingInline: 'sm',
    fontSize: 'md',
    fontWeight: 'secondaryFont.bold',
    backgroundColor: 'transparent',
    color: 'text.base.default',
    outline: 'none',
    zIndex: 1,
  }),
  {
    opacity: '.6',
    whiteSpace: 'nowrap',
    selectors: {
      '&[data-selected="true"]': {
        opacity: '1',
        color: tokens.kda.foundation.color.text.brand.primary.default,
      },
      '.focusVisible &:focus-visible': {
        borderTopLeftRadius: tokens.kda.foundation.radius.sm,
        borderTopRightRadius: tokens.kda.foundation.radius.sm,
        outline: `2px solid ${tokens.kda.foundation.color.accent.brand.primary}`,
      },
    },
  },
]);

export const selectorLine = style([
  atoms({
    position: 'absolute',
    display: 'block',
    height: '100%',
    bottom: 0,
    borderStyle: 'solid',
  }),
  {
    width: 0,
    borderWidth: 0,
    borderBottomWidth: tokens.kda.foundation.border.width.normal,
    borderColor: tokens.kda.foundation.color.accent.brand.primary,
    transition: 'transform .4s ease, width .4s ease',
    transform: `translateX(0)`,
  },
]);

export const tabContentClass = style([
  atoms({
    marginBlock: 'md',
    fontSize: 'base',
    color: 'text.base.default',
    flex: 1,
    overflowY: 'auto',
  }),
]);
