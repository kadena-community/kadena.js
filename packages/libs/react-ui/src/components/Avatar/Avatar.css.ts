import { recipe } from '@vanilla-extract/recipes';
import { atoms, token } from '../../styles';

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
        background: token('color.categorical.category1.default'),
      },
      category2: {
        background: token('color.categorical.category2.default'),
      },
      category3: {
        background: token('color.categorical.category3.default'),
      },
      category4: {
        background: token('color.categorical.category4.default'),
      },
      category5: {
        background: token('color.categorical.category5.default'),
      },
      category6: {
        background: token('color.categorical.category6.default'),
      },
      category7: {
        background: token('color.categorical.category7.default'),
      },
      category8: {
        background: token('color.categorical.category8.default'),
      },
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
        background: token('color.background.semantic.positive.default'),
      },
      negative: {
        background: token('color.background.semantic.negative.default'),
      },
      info: {
        background: token('color.background.semantic.info.default'),
      },
      warning: {
        background: token('color.background.semantic.warning.default'),
      },
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
