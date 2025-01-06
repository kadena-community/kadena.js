import { recipe } from '@kadena/kode-ui';
import { atoms, token } from '@kadena/kode-ui/styles';

export const wrapperClass = recipe({
  base: [
    atoms({
      padding: 'md',
      border: 'hairline',
    }),
    {
      height: '400px',
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
