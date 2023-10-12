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
  sprinkles({ fontSize: '$xs', marginY: '$6' }),
]);
export const notificationLinkStyle = style([
  sprinkles({ color: '$neutral5', fontWeight: '$bold' }),
]);

export const pubKeysContainerWrapper = style([
  sprinkles({ color: '$neutral5', fontWeight: '$bold', fontSize: '$xs' }),
]);

export const pubKeyInputWrapperStyle = style([
  sprinkles(
  {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
  }),
  {
    width: 'auto',
  }
]);

export const keyIconWrapperStyle = style([
  sprinkles(
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    color: '$primaryAccent',
  }),
]);

export const inputWrapperStyle = style([
  {
    width: '90%',
  },
]);

export const iconButtonWrapper = style([
  sprinkles({
    width: '$sm',
    position: 'absolute',
    bottom: 0,
    right: 0,
  }),
]);
