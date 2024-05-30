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
    color: tokens.kda.foundation.color.text.base.default,
    selectors: {
      ' &:hover': {
        color: tokens.kda.foundation.color.text.base.inverse['@active'],
        background:
          tokens.kda.foundation.color.background.accent.primary.inverse[
            '@active'
          ],
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
