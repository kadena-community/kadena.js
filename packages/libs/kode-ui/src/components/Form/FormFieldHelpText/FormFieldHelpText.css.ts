import { recipe, token } from '../../../styles';
import { iconFill } from '../Form.css';

export const helperText = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: token('spacing.xxs'),
    fontSize: token('typography.fontSize.xs'),
    color: token('color.text.semantic.info.default'),
  },
  defaultVariants: {
    intent: 'info',
  },
  variants: {
    intent: {
      default: {
        color: token('color.text.base.default'),
        vars: {
          [iconFill]: token('color.icon.base.default'),
        },
      },
      info: {
        color: token('color.text.semantic.info.default'),
      },
      negative: {
        color: token('color.text.semantic.negative.default'),
      },
      positive: {
        color: token('color.text.semantic.positive.default'),
      },
      warning: {
        color: token('color.text.semantic.warning.default'),
      },
    },
  },
});
