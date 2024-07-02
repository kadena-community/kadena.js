import { atoms, responsiveStyle, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const sideMenuClass = style([
  atoms({
    position: 'relative',
  }),
  {
    height: `calc(100vh - ${tokens.kda.foundation.size.n18})`,
    overflowY: 'auto',
    overflowX: 'hidden',
    ...responsiveStyle({
      md: {
        height: `calc(100vh - ${tokens.kda.foundation.size.n48})`,
      },
    }),
  },
]);

export const listClass = style([
  atoms({
    padding: 'no',
  }),
  {
    listStyle: 'none',
  },
]);
export const searchButtonClass = style([
  atoms({
    border: 'none',
    paddingInline: 'n2',
    cursor: 'pointer',
  }),
  {
    backgroundColor: 'transparent',
  },
]);

export const listItemClass = style([
  atoms({
    paddingBlockStart: 'md',
    paddingBlockEnd: 'sm',
  }),
  {
    borderBottom: `1px solid ${tokens.kda.foundation.color.border.base.bold}`,
  },
]);

export const sideMenuTitleClass = style([
  atoms({
    display: 'block',
    padding: 'no',
    textAlign: 'left',
    fontSize: 'sm',
    backgroundColor: 'transparent',
    border: 'none',
    paddingInlineStart: 'md',
    marginBlock: 'md',
  }),
]);

export const sideMenuTitleButtonClass = style([
  atoms({
    display: {
      sm: 'flex',
      md: 'none',
    },
    textAlign: 'left',
    cursor: 'pointer',
    paddingInlineStart: 'xxl',
    border: 'none',
    backgroundColor: 'transparent',
  }),
  {
    selectors: {
      '&:hover::before': {
        transform: `translate(0, ${tokens.kda.foundation.size.n2}) rotate(45deg)`,
      },
      '&::before': {
        position: 'absolute',
        left: tokens.kda.foundation.size.n3,
        top: tokens.kda.foundation.size.n5,
        content: '',
        width: tokens.kda.foundation.spacing.sm,
        height: tokens.kda.foundation.spacing.sm,
        borderLeft: `2px solid ${tokens.kda.foundation.color.border.base.inverse.default}`,
        borderBottom: `2px solid ${tokens.kda.foundation.color.border.base.inverse.default}`,
        transform: `translate(${tokens.kda.foundation.spacing.sm}, ${tokens.kda.foundation.spacing.sm}) rotate(45deg)`,
        transition: 'transform .2s ease ',
      },
    },
  },
]);
