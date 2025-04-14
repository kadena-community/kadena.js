import { createVar } from '@vanilla-extract/css';
import { recipe, token } from '../../styles';

export const bgColor = createVar();

export const dividerClass = recipe({
  base: {
    vars: {
      [bgColor]: token('color.background.layer.solid'),
    },
    width: '100%',
    marginBlock: token('spacing.lg'),
    border: 'none',
    borderTopWidth: token('border.width.hairline'),
    borderTopStyle: 'solid',
    height: 'auto',
  },
  variants: {
    label: {
      true: {
        position: 'relative',
        overflow: 'visible',
        selectors: {
          '&:after': {
            display: 'flex',
            justifySelf: 'anchor-center',
            whiteSpace: 'nowrap',
            marginInline: 'auto',
            paddingInline: token('spacing.sm'),
            content: 'attr(data-label)',
            position: 'absolute',
            transform: 'translateY(-13px)',
            backgroundColor: bgColor,
          },
        },
      },
      false: {},
    },
    variant: {
      subtle: {
        borderColor: token('color.border.base.subtle'),
        color: token('color.border.base.subtle'),
      },
      base: {
        borderColor: token('color.border.base.default'),
        color: token('color.border.base.default'),
      },
      bold: {
        borderColor: token('color.border.base.bold'),
        color: token('color.border.base.bold'),
      },
      boldest: {
        borderColor: token('color.border.base.boldest'),
        color: token('color.border.base.boldest'),
      },
      highContrast: {
        borderColor: token('color.border.base.high-contrast'),
        color: token('color.border.base.high-contrast'),
      },
    },
  },
});
