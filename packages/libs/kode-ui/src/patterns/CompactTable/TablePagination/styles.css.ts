import { atoms, style, token } from './../../../styles';

export const buttonClass = style([
  atoms({
    color: 'text.base.default',
    borderRadius: 'xs',
    borderColor: 'base.default',
    borderWidth: 'hairline',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    paddingInline: 'sm',
    paddingBlock: 'sm',
    cursor: 'pointer',
  }),
  {
    minWidth: '40px',
    selectors: {
      '&:hover': {
        backgroundColor: token('color.background.base.@active'),
        borderColor: token('color.border.base.@active'),
        color: token('color.text.base.@active'),
      },
    },
  },
]);

export const paginationClass = style([
  atoms({
    paddingInline: 'md',
  }),
]);

export const disabledClass = style([
  atoms({
    cursor: 'not-allowed',
  }),
  {
    backgroundColor: token('color.background.base.@disabled'),
    borderColor: token('color.border.base.@disabled'),
    color: token('color.text.base.@disabled'),
    selectors: {
      '&:hover': {
        backgroundColor: token('color.background.base.@disabled'),
        borderColor: token('color.border.base.@disabled'),
        color: token('color.text.base.@disabled'),
      },
    },
  },
]);
