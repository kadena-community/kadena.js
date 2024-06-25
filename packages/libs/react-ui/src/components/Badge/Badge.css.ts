import { recipe, token } from '../../styles';

export const badge = recipe({
  base: {
    borderRadius: token('radius.xs'),
    border: token('border.hairline'),
    padding: token('spacing.xs'),
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: token('typography.lineHeight.base'),
    fontWeight: token('typography.weight.primaryFont.bold'),
    borderColor: token('color.neutral.n1@alpha20'),
    color: token('color.text.base.inverse.@init'),
  },
  variants: {
    size: {
      lg: {
        height: token('size.n8'),
        minWidth: token('size.n8'),
        paddingInline: token('size.n2'),
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
      highContrast: {
        backgroundColor: token('color.background.base.inverse.default'),
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
