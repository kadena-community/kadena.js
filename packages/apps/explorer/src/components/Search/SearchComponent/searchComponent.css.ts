import { atoms, responsiveStyle, token, tokens } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const searchBoxClass = style({});

globalStyle(`${searchBoxClass} svg`, {
  minWidth: token('icon.size.base'),
});

export const searchBoxWrapperClass = style([
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
    overflow: 'hidden',
    zIndex: token('zIndex.dropdown'),
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
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 'md',
    fontFamily: 'monospaceFont',
    outline: 'none',
    color: 'text.base.default',
    paddingInline: 'sm',
  }),
  {
    height: 46,
    border: 'none',
    overflowX: 'auto',
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
export const searchBadgeBoxHeaderClass = style([
  responsiveStyle({
    xs: {
      display: 'none',
    },
    lg: {
      display: 'flex',
    },
  }),
]);

export const editingBoxClass = style([
  atoms({
    fontSize: 'md',
    position: 'absolute',
    fontFamily: 'primaryFont',
    backgroundColor: 'overlay.default',
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
