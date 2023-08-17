import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const cardContainerStyle = style([
  sprinkles({
    // width: '$xl',
    // fontSize: '$xs',
  }),
]);

export const helperStyle = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'row-reverse',
    // alignItems: 'flex-end',
    // textAlign: 'right',
    gap: '$1',
    cursor: 'pointer',
    color: '$neutral5'
  }),
]);

export const helperTextIconStyle = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    cursor: 'pointer',
    color: '$neutral5'
  }),
]);

// export const linkColorStyle = style([
//   sprinkles({
//
//   }),
// ]);


