import { atoms, darkThemeClass, tokens } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const tableClass = style([
  atoms({ width: '100%' }),
  {
    border: `1px solid ${tokens.kda.foundation.color.border.base.default}`,
  },
]);

export const trClass = style([
  atoms({ width: '100%', padding: 'md' }),
  {
    selectors: {
      ' &:hover': {
        background: tokens.kda.foundation.color.palette.blue.n10,
      },
      [`${darkThemeClass} &:hover`]: {
        background: tokens.kda.foundation.color.palette.blue.n100,
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
    color: tokens.kda.foundation.color.neutral.n40,
  },
]);

globalStyle(`${tableClass} > a`, {
  textDecoration: 'none',
});
globalStyle(`${tableClass} > a:nth-child(even)`, {
  background: tokens.kda.foundation.color.neutral.n1,
});
