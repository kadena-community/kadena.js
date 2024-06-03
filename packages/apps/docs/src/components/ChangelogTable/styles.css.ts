import { atoms, tokens } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const tableClass = style([
  atoms({ width: '100%' }),
  {
    border: `1px solid ${tokens.kda.foundation.color.border.base.default}`,
  },
]);
export const cellClass = style([
  atoms({ display: 'flex', alignItems: 'center' }),
]);

export const trClass = style([
  atoms({ width: '100%', padding: 'sm' }),
  {
    color: tokens.kda.foundation.color.text.base.default,
    selectors: {
      ' &:hover': {
        background: tokens.kda.foundation.color.background.base['@hover'],
      },
    },
  },
]);

export const listClass = style([
  {
    listStyle: 'none',
    margin: '0',
  },
]);
export const dateClass = style([
  {
    opacity: '.6',
  },
]);

globalStyle(`${tableClass} > a`, {
  textDecoration: 'none',
});
globalStyle(`${tableClass} > a:nth-child(even)`, {
  background: tokens.kda.foundation.color.background.surface.default,
});
