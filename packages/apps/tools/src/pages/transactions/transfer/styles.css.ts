import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const notificationLinkStyle = style([
  atoms({
    fontWeight: 'bodyFont.bold',
    textDecoration: 'underline',
    color: 'inherit',
    cursor: 'pointer',
  }),
]);

export const chainSelectContainerClass = style([
  { width: tokens.kda.foundation.size.n56 },
]);

export const buttonContainerClass = style([
  atoms({ display: 'flex', justifyContent: 'flex-end' }),
]);
