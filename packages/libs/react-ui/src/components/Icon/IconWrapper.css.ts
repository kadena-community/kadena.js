import { createVar, style, styleVariants } from '@vanilla-extract/css';
import { atoms, token } from '../../styles';

export const iconFill = createVar();
export const iconContainer = style([
  atoms({
    display: 'block',
    flexShrink: 0,
  }),
  {
    fill: iconFill,
    // a hack to override the fill color of the svg if it uses currentColor
    color: iconFill,
    // transform hack is needed for Safari (and iOS Chrome)
    // if not the multipy mixBlendMode will not work
    // the transform will take the icon out of its render layer and will render the icon correctly
    transform: 'translate3d(0,0,0)',
  },
]);

export const sizeVariants = styleVariants({
  xs: { height: token('size.n3') },
  sm: { height: token('size.n4') },
  md: { height: token('size.n6') },
  lg: { height: token('size.n8') },
  xl: { height: token('size.n10') },
});
