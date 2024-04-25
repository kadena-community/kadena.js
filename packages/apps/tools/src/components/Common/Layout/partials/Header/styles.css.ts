import { atoms, darkThemeClass, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const walletConnectWrapperStyle = style([
  atoms({
    marginInlineStart: 'md',
  }),
]);

export const headerButtonsWrapperStyle = style([
  atoms({
    display: 'flex',
    marginInlineEnd: 'sm',
  }),
]);

export const headerButtonStyle = style([
  atoms({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginInlineEnd: 'sm',
    color: 'text.gray.inverse.default',
  }),
  {
    padding: tokens.kda.foundation.size.n3,
    selectors: {
      [`${darkThemeClass} &`]: {
        color: tokens.kda.foundation.color.neutral.n70,
      },
      [`${darkThemeClass} &:hover`]: {
        color: tokens.kda.foundation.color.neutral.n100,
      },
      [`&:hover`]: {
        color: tokens.kda.foundation.color.neutral.n0,
      },
    },
  },
]);

export const rightSideMenu = style([
  atoms({ flex: 1, display: 'flex' }),
  {
    maxWidth: '25%',
    minWidth: '200px',
  },
]);
