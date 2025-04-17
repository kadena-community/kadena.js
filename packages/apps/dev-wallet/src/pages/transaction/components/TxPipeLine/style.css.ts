import { recipe, style } from '@kadena/kode-ui';
import { atoms, token } from '@kadena/kode-ui/styles';

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

export const iconSuccessClass = recipe({
  base: {
    color: token('color.icon.semantic.positive.default'),
  },
  variants: {
    variant: {
      success: {
        color: token('color.icon.semantic.positive.default'),
      },
      failure: {
        color: token('color.icon.semantic.negative.default'),
      },
    },
  },
});

export const capabilityClass = recipe({
  base: [
    atoms({
      borderRadius: 'sm',
      borderWidth: 'hairline',
      borderStyle: 'solid',
      gap: 'sm',
      padding: 'n3',
    }),
  ],
  variants: {
    isSigned: {
      true: {
        backgroundColor: token('color.background.semantic.positive.subtlest'),
        borderColor: token('color.border.tint.@focus'),
      },
      false: {
        backgroundColor: token('color.background.brand.secondary.subtlest'),
        borderColor: token('color.border.tint.outline'),
      },
    },
  },
});
