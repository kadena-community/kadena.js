import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const containerClass = style([
  {
    width: '680px',
  },
]);

export const buttonContainerClass = style([
  { display: 'flex', flexDirection: 'row-reverse' },
]);
export const notificationContainerStyle = style([
  sprinkles({  fontSize: '$xs', marginY: '$6' }),
]);


