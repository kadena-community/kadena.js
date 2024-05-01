import { globalStyle, style, styleVariants } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { atoms, ellipsis, token } from '../../../styles';
import { inputFontTypeVariants, inputSizeCompoundVariants } from '../Form.css';

export const selectButtonValue = atoms({
  display: 'flex',
  flex: 1,
});

export const selectButtonClass = style([
  atoms({
    display: 'flex',
    backgroundColor: 'input.default',
    justifyContent: 'space-between',
    color: 'text.base.default',
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
  }),
  {
    paddingBlock: '0',
    paddingInlineStart: token('spacing.md'),
    paddingInlineEnd: '0',
    selectors: {
      '&[data-hovered]': {
        cursor: 'pointer',
      },
    },
  },
]);

globalStyle(`${selectButtonClass} > span`, {
  fontFamily: 'unset',
});

// applied on a span
export const selectValueClass = style([
  ellipsis,
  {
    flex: '1',
    textAlign: 'start',
    selectors: {
      "&[data-placeholder='true']": {
        color: token('color.text.subtlest.default'),
      },
    },
  },
]);

export const selectIconWrapper = style([
  atoms({
    backgroundColor: 'surface.default',
    padding: 'n2',
  }),
]);

export const selectIconClass = styleVariants({
  sm: { height: token('icon.size.xs') },
  md: { height: token('icon.size.base') },
  lg: { height: token('icon.size.lg') },
});

export const selectItemClass = recipe({
  base: [atoms({ paddingInlineStart: 'md' })],
  variants: {
    size: {
      sm: [],
      md: [],
      lg: [],
    },
    ...inputFontTypeVariants,
  },
  compoundVariants: inputSizeCompoundVariants,
});
