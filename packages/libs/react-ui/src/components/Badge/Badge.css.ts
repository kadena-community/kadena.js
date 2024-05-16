import { recipe } from '@vanilla-extract/recipes';
import { atoms, token } from '../../styles';

export const badge = recipe({
  base: [
    atoms({
      borderRadius: 'xs',
      border: 'hairline',
      padding: 'xs',
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      lineHeight: 'base',
      fontWeight: 'primaryFont.bold'
    }),
    {
      borderColor: token('color.neutral.n1@alpha20'),
      color: token('color.text.base.inverse.@init'),
    },
  ],
  variants: {
    size: {
      lg: {
        height: token('size.n8'),
        minWidth: token('size.n8'),
        fontSize: token('typography.fontSize.sm'),
      },
      sm: {
        height: token('size.n4'),
        minWidth: token('size.n4'),
        fontSize: token('typography.fontSize.xs'),
      },
    },
    style: {
      default: {
        backgroundColor: token('color.neutral.n99@alpha20'),
        borderColor: token('color.neutral.n99@alpha10'),
        color: token('color.text.base.@init'),
      },
      inverse: {
        backgroundColor: token('color.neutral.n1@alpha10'),
      },
      info: {
        backgroundColor: token(
          'color.background.semantic.info.inverse.default',
        ),
      },
      warning: {
        backgroundColor: token(
          'color.background.semantic.warning.inverse.default',
        ),
      },
      positive: {
        backgroundColor: token(
          'color.background.semantic.positive.inverse.default',
        ),
      },
      negative: {
        backgroundColor: token(
          'color.background.semantic.negative.inverse.default',
        ),
      },
    },
  },
});
