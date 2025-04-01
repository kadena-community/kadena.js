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
      'button&': {
        cursor: 'pointer',
      },
      '&:not([data-disabled="true"]):hover, &:active:hover': {
        backgroundColor: token('color.background.brand.primary.subtle'),
        borderColor: token('color.border.base.@hover'),
      },
      '&:focus, &[data-focused="true"], &[data-focus-visible="true"]': {
        outline: `${token('color.border.tint.outline')} solid ${token('border.width.normal')}`,
        outlineOffset: token('border.width.normal'),
        backgroundColor: token('color.background.layer.default'),
        borderColor: token('color.border.base.@hover'),
        borderWidth: '10px',
      },

      '&:active, &[data-status="active"], &[data-selected="true"]': {
        backgroundColor: token('color.background.brand.primary.subtlest'),
        borderColor: token('color.border.tint.@focus'),
      },
      '&:disabled, &[data-disabled="true"]': {
        opacity: '.2',
      },
    },
  },
]);
