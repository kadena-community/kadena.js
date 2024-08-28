import { atoms, responsiveStyle, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const blockInfoClass = style([
  atoms({
    backgroundColor: 'layer.default',
    padding: 'md',
    borderColor: 'base.default',
    borderStyle: 'solid',
    borderWidth: 'hairline',
  }),
  {
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderEndEndRadius: tokens.kda.foundation.radius.sm,
    borderEndStartRadius: tokens.kda.foundation.radius.sm,
  },
  responsiveStyle({
    md: {
      width: 'auto',
    },
  }),
]);
