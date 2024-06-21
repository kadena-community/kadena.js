import { style, token } from '../../styles';

// applied on ul
export const listBoxClass = style({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  listStyleType: 'none',
  overflowX: 'hidden',
  boxShadow: `0px 1px 0 0 ${token('color.border.base.default')}`,
  selectors: {
    "&[data-scrollable='true']": {
      maxHeight: '500px',
      overflowY: 'auto',
    },
    "&[data-submenu='true']": {
      padding: 0,
      borderRadius: 0,
      boxShadow: 'none',
    },
    '&[data-focus-visible="true"]': {
      outlineColor: token('color.border.tint.outline'),
    },
    '&[data-focused="true"]': {
      outlineColor: token('color.border.tint.outline'),
    },
  },
});

// applied on li
export const listItemClass = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  listStyleType: 'none',
  paddingBlock: token('spacing.sm'),
  paddingInline: token('spacing.sm'),
  color: token('color.text.base.default'),
  cursor: 'pointer',
  transition: 'background 0.2s',
  ':focus': {
    outline: 'none',
  },
  ':focus-visible': {
    outline: 'none',
  },
  selectors: {
    '&[data-hovered="true"]': {
      color: token('color.text.base.default'),
      backgroundColor: token('color.background.input.@hover'),
    },
    '&[data-disabled="true"]': {
      color: token('color.text.base.@disabled'),
      cursor: 'not-allowed',
    },
    '&[data-focused="true"]': {
      color: token('color.text.semantic.info.@focus'),
      backgroundColor: token('color.background.input.@focus'),
    },
    '&[data-selected="true"]': {
      backgroundColor: token('color.background.accent.primary.inverse.default'),
      color: token('color.text.base.inverse.default'),
      fontWeight: token('typography.weight.secondaryFont.bold'),
    },
    '&[data-has-children="true"]': {
      padding: '0',
      marginBlock: token('spacing.xs'),
    },
  },
});

// applied on li
export const listSeparatorClass = style({
  listStyleType: 'none',
  margin: 0,
  padding: 0,
  backgroundColor: token('color.background.base.default'),
  height: '1px',
});

// applied on span
export const listSectionHeadingClass = style({
  display: 'flex',
  paddingBlock: token('spacing.xs'),
  paddingInline: token('spacing.sm'),
  color: token('color.text.base.default'),
  backgroundColor: token('color.background.surface.default'),
  fontWeight: token('typography.weight.secondaryFont.bold'),
  cursor: 'default',
  alignSelf: 'stretch',
});
