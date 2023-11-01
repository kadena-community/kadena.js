import {darkThemeClass, sprinkles, vars} from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const walletConnectWrapperStyle = style([
  sprinkles({
    marginLeft: '$4',
  }),
]);
export const addCustomNetworkWrapperStyle = style([
  sprinkles({
    marginLeft: '$4',
  }),
]);

export const headerButtonStyle = style([
  sprinkles({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '$5',
    color: '$gray40',
  }),
  {
    transition: 'all 0.1s ease',
    width: '100%',
    selectors: {
      [`${darkThemeClass} &:hover`]: {
        color: vars.colors.$white,
      },
      [`&:hover`]: {
        color: vars.colors.$white,
      },
      [`${darkThemeClass} &.active`]: {
        backgroundColor: vars.colors.$blue80,
      },
      [`&.active`]: {
        backgroundColor: vars.colors.$blue20,
      },
      [`${darkThemeClass} &.active:hover`]: {
        color: vars.colors.$blue20,
      },
      ['&.active:hover']: {
        color: vars.colors.$blue60,
      },
    },
  },
])
