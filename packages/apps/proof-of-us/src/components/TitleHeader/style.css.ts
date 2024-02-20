import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const headerClass = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'md',
    paddingBlock: 'sm',
  }),
]);
export const spacerClass = style([
  atoms({
    flex: 1,
  }),
]);
