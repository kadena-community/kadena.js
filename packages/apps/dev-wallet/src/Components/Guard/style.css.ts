import { atoms, recipe, style, token } from '@kadena/kode-ui/styles';
import { globalStyle } from '@vanilla-extract/css';

export const backgroundClass = recipe({
  base: [
    atoms({
      borderWidth: 'hairline',
      borderStyle: 'solid',
      borderRadius: 'xs',
      paddingInline: 'n2',
      paddingBlock: 'n1',
    }),
  ],
  variants: {
    isSelected: {
      true: {
        borderColor: token('color.neutral.n99@alpha10'),
        backgroundColor: token('color.background.base.inverse.default'),
      },
      false: {
        borderColor: token('color.neutral.n99@alpha10'),
        backgroundColor: token('color.background.input.default'),
      },
    },
  },
});

export const labelClass = style({});

globalStyle(`${backgroundClass}[data-isselected="true"] [class^="Checkbox"]`, {
  color: token('color.text.base.inverse.default'),
});
