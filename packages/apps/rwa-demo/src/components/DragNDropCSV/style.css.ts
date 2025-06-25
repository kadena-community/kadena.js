import { recipe } from '@kadena/kode-ui';
import { atoms, token } from '@kadena/kode-ui/styles';

export const wrapperClass = recipe({
  base: [
    atoms({
      padding: 'md',
      border: 'hairline',
    }),
    {
      maxHeight: '400px',
      height: 'clamp(100px, 50vh, 400px)',
      borderStyle: 'dashed!important',
      borderWidth: '4px!important',
    },
  ],
  variants: {
    isHover: {
      true: {
        borderColor: `${token('color.border.base.@active')}!important`,
      },
      false: {},
    },
  },
});
