import { style } from '@vanilla-extract/css';
import { atoms, token } from './../../../styles';

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
