import { style, token } from '../../styles';
import { tokens } from '../../styles/tokens/contract.css';

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
      marginInline: tokens.kda.foundation.spacing.sm,
    },
    '&:last-child::before': {
      content: '∙',
      marginInline: tokens.kda.foundation.spacing.sm,
    },
    '&:first-child': {
      fontWeight: 'bold',
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
      color: tokens.kda.foundation.color.text.base.default,
    },
    '&[data-current="true"]': {
      textDecoration: 'none',
      cursor: 'default',
    },
    "&[data-disabled='true']": {
      textDecoration: 'none',
      cursor: 'default',
      color: tokens.kda.foundation.color.text.base['@disabled'],
    },
  },
});

export const navClass = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'max-content',
});
