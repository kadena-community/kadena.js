import { style } from '@vanilla-extract/css';
import { atoms, globalStyle, token } from './../../../styles';

export const sidebartreeListClass = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    gap: 'xs',
  }),
  {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
]);

export const sidebartreeItemClass = style([
  atoms({
    fontFamily: 'primaryFont',
    fontWeight: 'primaryFont.medium',
    fontSize: 'xs',
    lineHeight: 'md',
    color: 'text.gray.default',
    padding: 'no',
    paddingInlineStart: 'xxxl',
    textDecoration: 'none',
  }),
  {
    listStyle: 'none',
    margin: 0,

    selectors: {
      '&[data-isactive="true"]': {
        color: token('color.link.base.default'),
      },
      '&:hover': {
        textDecoration: 'underline',
        opacity: '.9',
      },
    },
  },
]);

export const sidebarTreeWrapperClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    border: 'none',
    cursor: 'pointer',
    color: 'text.gray.default',
    paddingBlock: 'sm',
    paddingInline: 'xs',
    gap: 'md',
  }),
  {
    backgroundColor: 'transparent',
  },
]);

globalStyle(`${sidebarTreeWrapperClass} svg`, {
  width: '12px',
});
