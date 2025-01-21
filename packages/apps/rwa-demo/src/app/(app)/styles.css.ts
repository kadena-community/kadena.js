import { style } from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';

export const actionsWrapperClass = style([
  atoms({
    justifyContent: 'flex-start',
    gap: 'sm',
    flexWrap: 'wrap',
  }),
]);
