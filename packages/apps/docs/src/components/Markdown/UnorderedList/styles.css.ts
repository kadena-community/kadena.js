import { sprinkles, vars } from '@kadena/react-ui/theme';

import { globalStyle, style } from '@vanilla-extract/css';

export const ulList = style([
  sprinkles({
    marginY: '$5',
    marginX: 0,
  }),
]);

export const ilItem = style([
  {
    selectors: {
      '&::marker': {
        color: '$primaryHighContrast',
        fontWeight: '$bold',
      },
    },
  },
]);

globalStyle(`${ulList} ${ilItem} ul`, {
  paddingLeft: vars.sizes.$4,
  margin: 0,
  backgroundColor: 'red',
});
