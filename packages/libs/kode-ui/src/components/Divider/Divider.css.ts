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
  compoundVariants: [
    {
      variants: {
        label: true,
        align: 'center',
      },
      style: {
        selectors: {
          '&:after': {
            justifySelf: 'anchor-center',
            marginInline: 'auto',
          },
        },
      },
    },
    {
      variants: {
        label: true,
        align: 'end',
      },
      style: {
        selectors: {
          '&:after': {
            position: 'relative',
            float: 'right',
            marginBlockEnd: '-23px',
          },
        },
      },
    },
  ],
  variants: {
    align: {
      start: {},
      center: {},
      end: {},
    },
    label: {
      true: {
        position: 'relative',
        overflow: 'visible',
        selectors: {
          '&:after': {
            display: 'flex',
            whiteSpace: 'nowrap',

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
