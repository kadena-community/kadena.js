import { atoms, token, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const searchBoxClass = style([
  atoms({
    position: 'absolute',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 'hairline',
    borderRadius: 'sm',
    borderColor: 'base.subtle',
    backgroundColor: 'layer.default',
    paddingBlock: 'xs',
    gap: 'xs',
  }),
  {
    zIndex: 1,
  },
]);

export const searchBoxEditingClass = style([
  atoms({}),
  {
    height: '250px',
  },
]);

export const searchInputClass = style([
  atoms({
    backgroundColor: 'transparent',
    fontSize: 'md',
    fontFamily: 'monospaceFont',
    outline: 'none',
    color: 'text.base.default',
    flex: 1,
  }),
  {
    height: 46,
    border: 'none',

    selectors: {
      '&::placeholder': {
        fontFamily: tokens.kda.foundation.typography.family.primaryFont,
        color: 'text.gray.default',
      },
    },
  },
]);

export const searchBadgeBoxClass = style([
  atoms({
    borderRadius: 'xs',
    borderStyle: 'solid',
    borderWidth: 'hairline',
    borderColor: 'base.subtle',
    backgroundColor: 'input.default',
    color: 'text.subtlest.default',
    paddingInline: 'sm',
  }),
  {
    whiteSpace: 'nowrap',
  },
]);

export const searchBadgeBoxSelectedClass = style([
  {
    backgroundColor: token('color.background.base.inverse.default'),
    color: token('color.text.base.inverse.default'),
  },
]);

export const editingBoxClass = style([
  atoms({
    fontSize: 'md',
    position: 'absolute',
    fontFamily: 'primaryFont',
  }),
  {
    top: '45px',
    width: '100%',
  },
]);

export const searchBarClass = style({
  maxWidth: '650px',
  width: '100%',
  marginInline: 'auto',
});

export const editOptionClass = style([
  atoms({
    paddingInline: 'lg',
    paddingBlock: 'sm',
    cursor: 'pointer',
    color: 'text.base.default',
  }),
]);

export const editOptionHoverClass = style([
  {
    backgroundColor:
      tokens.kda.foundation.color.background.brand.primary.default,
    color: tokens.kda.foundation.color.text.base.default,
  },
]);
export const editOptionSelectedClass = style([
  {
    backgroundColor: token('color.background.brand.primary.inverse.default'),
    color: token('color.text.base.inverse.@focus'),
    borderLeft: `${tokens.kda.foundation.radius.md} solid ${tokens.kda.foundation.color.border.brand.primary.default}`,
  },
]);

export const iconColorClass = style({
  color: token('color.icon.base.default'),
});
