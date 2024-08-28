import { tokens } from '@kadena/kode-ui/styles';
import { keyframes, style } from '@vanilla-extract/css';

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const loaderClass = style([
  {
    width: tokens.kda.foundation.spacing.lg,
    height: tokens.kda.foundation.spacing.lg,
    animation: `${rotate} 1s infinite linear `,
  },
]);
