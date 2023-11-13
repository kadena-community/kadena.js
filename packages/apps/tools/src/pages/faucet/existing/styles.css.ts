import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const buttonContainerClass = style([
  sprinkles({ display: 'flex', flexDirection: 'row-reverse' }),
]);
export const notificationContainerStyle = style([sprinkles({ fontSize: '$xs', marginY: '$6' })]);
