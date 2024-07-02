import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const headerColumnStyle = style([
  atoms({
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderWidth: 'hairline',
    padding: 'md',
  }),
]);
