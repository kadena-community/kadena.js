import { atoms, recipe, style, token, uiBaseRegular } from '../../styles';

export const circle = recipe({
  base: [
    uiBaseRegular,
    {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: token('radius.round'),
      color: token('color.text.base.inverse.default'),
      overflow: 'visible',
    },
  ],
  variants: {
    size: {
      sm: {
        fontSize: token('typography.fontSize.sm'),
        width: token('size.n4'),
        height: token('size.n4'),
      },
      md: {
        fontSize: token('typography.fontSize.xs'), // typography.smallest
        width: token('size.n6'),
        height: token('size.n6'),
      },
      lg: {
        fontSize: token('typography.fontSize.sm'),
        width: token('size.n8'),
        height: token('size.n8'),
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
    size: 'md',
    color: 'category1',
  },
});

export const circleStatus = recipe({
  base: {
    position: 'absolute',
    borderRadius: token('radius.round'),
    transform: 'translate(50%, 50%)',
  },
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
      sm: {
        width: token('size.n1'),
        height: token('size.n1'),
        bottom: '2px',
        right: '2px',
      },
      md: {
        width: token('size.n2'),
        height: token('size.n2'),
        bottom: token('size.n1'),
        right: token('size.n1'),
      },
      lg: {
        width: token('size.n2'),
        height: token('size.n2'),
        bottom: token('size.n1'),
        right: token('size.n1'),
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const disabledStyle = style({
  opacity: 0.4,
  transition: 'opacity 0.2s ease-in-out',
});
