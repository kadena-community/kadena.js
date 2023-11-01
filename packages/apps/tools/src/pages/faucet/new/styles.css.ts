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
  sprinkles({ fontSize: '$sm', marginY: '$6' }),
]);
export const notificationLinkStyle = style([
  sprinkles({ color: '$neutral5', fontWeight: '$bold' }),
]);

export const pubKeyInputWrapperStyle = style([
  sprinkles({
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
  }),
  {
    width: 'auto',
  },
]);

export const keyIconWrapperStyle = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
    top: '$10',
    right: '$6',
  }),
]);

export const notificationContentStyle = style([
  sprinkles({
    display: 'inline-flex',
    alignItems: 'center',
  }),
]);

export const hoverTagContainerStyle = style([
  sprinkles({
    marginX: '$1',
  }),
]);
