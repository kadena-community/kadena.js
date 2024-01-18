import { atoms, darkThemeClass, tokens } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const walletConnectWrapperStyle = style([
  atoms({
    marginInlineStart: 'md',
  }),
]);

export const headerButtonStyle = style([
  atoms({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginInlineEnd: 'sm',
    color: 'text.gray.default',
  }),
  {
    padding: tokens.kda.foundation.size.n3,
    selectors: {
      [`${darkThemeClass} &:hover`]: {
        color: tokens.kda.foundation.color.neutral.n100,
      },
      [`&:hover`]: {
        color: tokens.kda.foundation.color.neutral.n0,
      },
    },
  },
]);
