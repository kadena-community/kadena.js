import { recipe } from '@vanilla-extract/recipes';
import { atoms } from '../../../../styles/atoms.css';
import { token } from '../../../../styles/themeUtils';
import { iconFill } from '../../../Icon/IconWrapper.css';

export const helperText = recipe({
  base: atoms({
    display: 'flex',
    alignItems: 'center',
    gap: 'xxs',
    fontSize: 'xs',
    color: 'text.semantic.info.default',
  }),
  defaultVariants: {
    intent: 'info',
  },
  variants: {
    intent: {
      info: {
        color: token('color.text.semantic.info.default'),
        vars: {
          [iconFill]: token('color.icon.semantic.info.default'),
        },
      },
      negative: {
        color: token('color.text.semantic.negative.default'),
        vars: {
          [iconFill]: token('color.icon.semantic.negative.default'),
        },
      },
      positive: {
        color: token('color.text.semantic.positive.default'),
        vars: {
          [iconFill]: token('color.icon.semantic.positive.default'),
        },
      },
      warning: {
        color: token('color.text.semantic.warning.default'),
        vars: {
          [iconFill]: token('color.icon.semantic.warning.default'),
        },
      },
    },
  },
});
