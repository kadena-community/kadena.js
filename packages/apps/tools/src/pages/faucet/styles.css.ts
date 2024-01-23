import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  atoms({
    maxWidth: 'content.maxWidth',
    minWidth: 'content.minWidth',
    height: '100%',
  }),
]);

export const inputContainerClass = style([
  atoms({
    display: 'flex',
    gap: 'md',
  }),
]);

export const accountNameContainerClass = style([{ flex: 1 }]);

export const chainSelectContainerClass = style([
  { width: tokens.kda.foundation.size.n25 },
]);

export const buttonContainerClass = style([
  atoms({ display: 'flex', justifyContent: 'flex-end' }),
]);

export const notificationContainerStyle = style([
  atoms({ fontSize: 'xs', marginBlock: 'lg' }),
]);
