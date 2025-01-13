import { style } from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';

export const actionsWrapperClass = style([
  atoms({
    justifyContent: 'space-between',
    gap: 'sm',
    flexWrap: 'wrap',
  }),
]);
