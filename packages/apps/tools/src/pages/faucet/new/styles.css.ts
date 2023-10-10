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
  {
    display: 'flex',
    alignItems: 'flex-start',
    width: 'auto',
    position: 'relative',
  },
]);

export const keyIconWrapperStyle = style([
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    color: '$primaryAccent',
    // position: 'relative'
  },
]);

export const inputWrapperStyle = style([
  {
    // display: 'flex',
    // alignItems: 'flex-start',
    width: '90%',
    // position: 'relative'
  },
]);

export const iconButtonWrapper = style([
  {
    width: '$sm',
    position: 'absolute',
    // top: 0,
    bottom: 0,
    right: 0,
    // display: 'flex',
    // alignItems: 'flex-start',
    // width: '100%',
  },
]);
