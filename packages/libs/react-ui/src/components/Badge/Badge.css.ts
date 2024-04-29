import { recipe } from '@vanilla-extract/recipes';
import { atoms, token } from '../../styles';

export const badge = recipe({
  base: atoms({
    borderRadius: 'xs',
    border: 'hairline',
    padding: 'xs',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 'base',
  }),
  variants: {
    size: {
      lg: {
        height: token('size.n8'),
        minWidth: token('size.n8'),
        fontSize: '14px',
      },
      sm: {
        height: token('size.n4'),
        minWidth: token('size.n4'),
        fontSize: '12px',
      },
    },
    style: {
      default: {
        backgroundColor: token('color.neutral.n99@alpha20'),
        borderColor: token('color.neutral.n99@alpha10'),
        color: token('color.neutral.n100@alpha70'),
      },
      inverse: {
        backgroundColor: token('color.neutral.n1@alpha10'),
        borderColor: token('color.neutral.n1@alpha20'),
        color: token('color.neutral.n0@alpha70'),
      },
      //kda/foundation/color/background/semantic/positive/inverse/default
      info: {
        backgroundColor: token(
          'color.background.semantic.info.inverse.default',
        ),
        borderColor: token('color.neutral.n1@alpha20'),
        color: token('color.neutral.n0@alpha70'),
      },
      warning: {
        backgroundColor: token(
          'color.background.semantic.warning.inverse.default',
        ),
        borderColor: token('color.neutral.n1@alpha20'),
        color: token('color.neutral.n0@alpha70'),
      },
      positive: {
        backgroundColor: token(
          'color.background.semantic.positive.inverse.default',
        ),
        borderColor: token('color.neutral.n1@alpha20'),
        color: token('color.neutral.n0@alpha70'),
      },
      negative: {
        backgroundColor: token(
          'color.background.semantic.negative.inverse.default',
        ),
        borderColor: token('color.neutral.n1@alpha20'),
        color: token('color.neutral.n0@alpha70'),
      },
    },
  },
});
