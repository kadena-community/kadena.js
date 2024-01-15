import { atoms } from '@theme/atoms.css';
import { tokens } from '@theme/tokens/contract.css';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  atoms({
    display: 'flex',
    padding: 'no',
  }),
  {
    flexFlow: 'wrap',
    listStyle: 'none',
  },
]);

export const itemClass = style([
  atoms({
    display: 'flex',
    padding: 'no',
    whiteSpace: 'nowrap',
  }),
  {
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
  },
]);

export const linkClass = style([
  atoms({
    display: 'flex',
    color: 'text.base.default',
  }),
  {
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
  },
]);

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
