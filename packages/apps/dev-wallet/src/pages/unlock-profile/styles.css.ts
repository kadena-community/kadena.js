import { style } from '@vanilla-extract/css';
import { tokens } from '@kadena/react-ui/styles';

export const passwordContainer = style([
  {
    marginTop: tokens.kda.foundation.spacing.md,
    minHeight: '100px'
  },
]);

export const profileContainer = style([
  {
    border: `1px solid ${tokens.kda.foundation.color.neutral.n20}`,
    marginBottom: tokens.kda.foundation.spacing.md,
  },
]);

