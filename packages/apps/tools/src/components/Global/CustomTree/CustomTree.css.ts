import { atoms, ellipsis, token } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerStyle = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
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
    ':hover': {
      backgroundColor: token('color.background.semantic.info.subtlest'),
    },
  },
]);

export const reloadButtonStyles = atoms({ marginInlineEnd: 'sm' });

export const firstLevelTreeNodeStyles = style({
  borderBlockEnd: '1px solid rgba(0, 0, 0, 0.25)',
});
