import { atoms, style, token } from '../../styles';

export const tileClass = style([
  atoms({
    borderRadius: 'sm',
    borderWidth: 'hairline',
    borderStyle: 'solid',
    borderColor: 'base.subtle',
    padding: 'n4',
    width: '100%',
    listStyleType: 'none',
  }),
  {
    backgroundColor: token('color.background.layer.default'),
    selectors: {
      '&:not([data-disabled="true"]):hover, &:active:hover, &[data-status="active"]:hover':
        {
          backgroundColor: token('color.background.brand.primary.subtle'),
          borderColor: token('color.border.base.@hover'),
        },
      '&:focus, &[data-status="focus"]': {
        backgroundColor: token('color.background.layer.default'),
        borderColor: token('color.border.base.@hover'),
        borderWidth: '10px',
      },
      '&:active, &[data-status="active"]': {
        backgroundColor: token('color.background.brand.primary.subtlest'),
        borderColor: token('color.border.tint.@focus'),
      },
      '&:disabled, &[data-disabled="true"]': {
        opacity: '.2',
      },
    },
  },
]);
