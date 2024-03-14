import { style } from '@vanilla-extract/css';

import { recipe } from '@vanilla-extract/recipes';
import { atoms, token } from '../../styles';

export const initialsClass = style([
  atoms({
    fontSize: '9xl',
    fontWeight: 'bodyFont.bold',
  }),
]);

export const circle = recipe({
  base: [
    atoms({
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bodyFont.regular',
      fontFamily: 'primaryFont', // will be updated with latest tokens
      borderRadius: 'round',
      color: 'text.base.inverse.default',
      overflow: 'visible',
    }),
    {
      backgroundColor: token('color.background.base.inverse.default'),
    },
  ],
  variants: {
    size: {
      lg: {
        fontSize: token('typography.fontSize.sm'),
        width: token('icon.size.lg'),
        height: token('icon.size.lg'),
      },
      sm: {
        fontSize: token('typography.fontSize.sm'), // no text
        width: token('icon.size.sm'),
        height: token('icon.size.sm'),
      },
      base: {
        fontSize: token('typography.fontSize.xs'), // typography.smallest
        width: token('icon.size.base'),
        height: token('icon.size.base'),
      },
    },
    color: {
      category1: {
        background: token('color.categorical.category1.default'), // color background
      },
      category2: {
        background: token('color.categorical.category2.default'), // color background
      }, //...
    },
  },
  defaultVariants: {
    size: 'base',
    color: 'category1',
  },
});

export const status = recipe({
  base: [
    atoms({
      position: 'absolute',
      borderRadius: 'round',
    }),
    {
      transform: 'translate(50%, 50%)',
    },
  ],
  variants: {
    status: {
      positive: {
        // background: token('color.background.semantic.info.default'),
        // background: token('color.background.semantic.negative.default'),
        background: token('color.background.semantic.positive.default'), // this is for status
      },
      negative: {
        background: token('color.background.semantic.negative.default'),
      }, //...
    },
    size: {
      lg: {
        width: '8px',
        height: '8px',
        bottom: '4px',
        right: '4px',
      },
      sm: {
        width: '4px',
        height: '4px',
        bottom: '2px',
        right: '2px',
      },
      base: {
        width: '8px',
        height: '8px',
        bottom: '4px',
        right: '4px',
      },
    },
  },
  defaultVariants: {
    size: 'base',
  },
});
