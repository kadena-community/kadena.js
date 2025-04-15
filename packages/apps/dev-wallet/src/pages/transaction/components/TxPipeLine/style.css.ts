import { style } from '@kadena/kode-ui';
import { atoms } from '@kadena/kode-ui/styles';

export const statusListWrapperClass = style([
  atoms({
    borderColor: 'base.subtle',
    borderWidth: 'hairline',
    borderStyle: 'solid',
    borderRadius: 'sm',
    padding: 'md',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
  }),
]);

export const iconSuccessClass = style([
  atoms({
    color: 'icon.semantic.positive.default',
  }),
]);
