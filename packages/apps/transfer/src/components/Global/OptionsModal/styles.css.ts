import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const modalOptionsContent = style([
  sprinkles({
    width: '100%',
    fontSize: '$xs',
  }),
]);

export const titleTag = style([
  sprinkles({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '$xs',
  }),
]);

export const modalButton = style([
  sprinkles({
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
    fontSize: '$xs',
  }),
]);

export const radioItemWrapper = style([
  sprinkles({
    cursor: 'pointer',
  }),
]);

export const largeIcon = style([
  sprinkles({
    size: '$lg',
  }),
]);
