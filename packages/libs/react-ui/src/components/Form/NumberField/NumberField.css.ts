import { style, styleVariants, token } from '../../../styles';

export const iconSize = styleVariants({
  sm: {
    fontSize: '11px',
  },
  md: {
    fontSize: '13px',
  },
  lg: {
    fontSize: token('size.n4'),
  },
});

/** The add-on icons should be bigger because of the
 *  functionality than the start visuals and have
 *  separate style variants.
 */
export const addOnIconSize = styleVariants({
  sm: {
    fontSize: token('size.n3'),
  },
  md: {
    fontSize: token('size.n4'),
  },
  lg: {
    fontSize: token('size.n6'),
  },
});

export const addOnStyleClass = style({
  aspectRatio: '1/1',
})

/** Storybook example style */
export const smallInputWrapper = style({
  maxWidth: token('screen.resolutions.width.mobile.apple.iphone_se'),
});
