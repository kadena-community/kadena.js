import { recipe, style, token } from './../../styles';

export const WIDTH = 8;

export const stepClass = recipe({
  base: {
    borderRadius: `${WIDTH / 2}px`,
    height: `${WIDTH}px`,
    width: `${WIDTH}px`,
    transition: 'all .5s ease',
  },
  variants: {
    isActive: {
      true: {
        backgroundColor: token('color.border.tint.@focus'),
      },
      false: {
        backgroundColor: token('color.border.base.default'),
      },
    },
  },
});

export const textClass = style({
  color: token('color.text.gray.default'),
});
export const textWrapperClass = style({
  transform: 'translate(-10px, 0px)',
  textWrap: 'nowrap',
});
export const iconWrapperClass = style({
  transform: 'translateY(-2px)',
  width: token('icon.size.sm'),
  maxHeight: token('icon.size.sm'),
  minHeight: token('icon.size.sm'),
});
