import { atoms, recipe, style, token } from './../../styles';

const WIDTH = 8;
export const stepClass = recipe({
  base: {
    borderRadius: `${WIDTH / 2}px`,
    height: `${WIDTH}px`,
    transition: 'all .5s ease',
  },
  variants: {
    isActive: {
      true: {
        width: `${WIDTH * 4}px`,
        backgroundColor: token('color.border.tint.@focus'),
      },
      false: {
        width: `${WIDTH}px`,
        backgroundColor: token('color.border.base.default'),
      },
    },
  },
});

export const textClass = style({
  color: token('color.text.gray.default'),
});
