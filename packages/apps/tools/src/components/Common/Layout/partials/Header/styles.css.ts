import { darkThemeClass, sprinkles, vars } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const walletConnectWrapperStyle = style([
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
    padding: '$3',
    marginRight: '$2',
    color: '$gray40',
  }),
  {
    selectors: {
      [`${darkThemeClass} &:hover`]: {
        color: vars.colors.$white,
      },
      [`&:hover`]: {
        color: vars.colors.$white,
      },
    },
  },
]);
