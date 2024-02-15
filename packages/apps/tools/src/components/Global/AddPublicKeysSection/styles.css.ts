import { atoms } from '@kadena/react-ui/styles';

import { style } from '@vanilla-extract/css';

export const buttonContainerClass = style([
  atoms({ display: 'flex', flexDirection: 'row-reverse' }),
]);

export const pubKeysContainerStyle = style([
  atoms({
    display: 'flex',
    marginBlock: 'sm',
    flexWrap: 'wrap',
    gap: 'sm',
  }),
]);
