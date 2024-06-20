import { style, token } from '../../styles';

export const containerClass = style({
  display: 'flex',
  padding: 0,
  flexFlow: 'wrap',
  listStyle: 'none',
});

export const itemClass = style({
  display: 'flex',
  padding: 0,
  whiteSpace: 'nowrap',
  selectors: {
    '&:not(:first-child):not(:last-child)::before': {
      content: '/',
      marginInline: token('spacing.sm'),
    },
    '&:last-child::before': {
      content: '∙',
      marginInline: token('spacing.sm'),
    },
    '&:first-child': {
      fontWeight: token('typography.weight.primaryFont.bold'),
    },
  },
});

export const linkClass = style({
  display: 'flex',
  color: token('color.text.base.default'),
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

export const navClass = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'max-content',
});
