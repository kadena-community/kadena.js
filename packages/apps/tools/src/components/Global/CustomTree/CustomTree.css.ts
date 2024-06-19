import { atoms, ellipsis, token } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerStyle = style({
  display: 'flex',
  flexDirection: 'column',
});

export const itemTitleStyle = style([
  ellipsis,
  {
    flex: 1,
    flexGrow: 2,
  },
]);

export const itemBadgeStyle = style([
  atoms({
    paddingInline: 'xs',
    paddingBlock: 'n0',
  }),
  {
    flex: 1,
    flexGrow: 4,
  },
]);

export const itemContainerStyle = style([
  atoms({
    paddingInlineEnd: 'md',
    paddingBlock: 'xs',
    border: 'hairline',
    borderColor: 'base.default',
  }),
  {
    minHeight: token('size.n10'),
    borderInline: 'none',
    borderBlockStart: 'none',
    borderBlockEnd: 'none',
    ':hover': {
      backgroundColor: token('color.background.semantic.info.subtlest'),
    },
  },
]);

export const topLevelItemContainerStyle = style({
  borderBlockEnd: `${token('border.width.hairline')} solid ${token('color.border.base.default')}`,
});

export const activeItemContainerStyle = style({
  backgroundColor: token('color.background.semantic.info.subtle'),
  borderInlineEnd: `${token('border.width.thick')} solid ${token('color.border.tint.outline')}`,
});

export const reloadButtonStyles = style({
  marginInlineEnd: token('spacing.sm'),
});

export const reloadIconStyles = style({
  selectors: {
    [`${reloadButtonStyles} &`]: {
      color: token('color.icon.base.inverse.default'),
    },
    [`${reloadButtonStyles}:hover &`]: {
      color: token('color.icon.base.@hover'),
    },
  },
});

export const reloadLoadingStyles = style({
  selectors: {
    [`${reloadButtonStyles} &`]: {
      color: token('color.icon.semantic.positive.default'),
    },
  },
});

export const firstLevelTreeNodeStyles = style({
  borderBlockEnd: `${token('border.width.hairline')} solid ${token('color.border.base.default')}`,
});

export const activeItemStyles = style({
  backgroundColor: token('color.background.semantic.info.subtle'),
  borderInlineEnd: `${token('border.width.thick')} solid ${token('color.border.tint.outline')}`,
});
