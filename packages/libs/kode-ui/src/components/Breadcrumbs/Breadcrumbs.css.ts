import { atoms, globalStyle, style, token } from '../../styles';

export const containerClass = style([
  atoms({
    display: 'flex',
    padding: 'no',
  }),
  {
    listStyle: 'none',
    flexFlow: 'wrap',
    marginBlockStart: '1px',
  },
]);

export const itemClass = style([
  atoms({
    fontSize: 'xxs',
  }),
  {
    display: 'flex',
    padding: 0,
    whiteSpace: 'nowrap',
    marginInlineEnd: token('spacing.sm'),
    selectors: {
      '&:not(:first-child):not(:last-child)::before': {
        content: '/',
        color: token('color.text.gray.default'),
        marginInlineEnd: token('spacing.sm'),
      },
      '&:not(:first-child):last-child::before': {
        content: '/',
        color: token('color.text.gray.default'),
        marginInlineEnd: token('spacing.sm'),
      },
    },
  },
]);

export const linkClass = style({
  display: 'flex',
  color: token('color.text.gray.default'),
  textDecoration: 'none',
  selectors: {
    '&:hover': {
      textDecoration: 'underline',
      color: token('color.text.base.default'),
    },
    '&[data-current="true"]': {
      textDecoration: 'none',
      cursor: 'default',
    },
    "&[data-disabled='true']": {
      textDecoration: 'none',
      cursor: 'default',
      color: token('color.text.base.@disabled'),
    },
  },
});

export const navClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  {
    width: 'max-content',
  },
]);

globalStyle(`${navClass} svg`, {
  width: '20px',
});
