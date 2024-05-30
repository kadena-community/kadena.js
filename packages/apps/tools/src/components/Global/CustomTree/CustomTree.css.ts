import { ellipsis, token } from '@kadena/react-ui/styles';
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

export const itemBadgeStyle = style({
  flex: 1,
  flexGrow: 4,
  padding: '0 4px',
  fontSize: '12px',
  lineHeight: '16px',
});

export const itemContainerStyle = style({
  minHeight: '40px',
  paddingInlineEnd: '16px',
  paddingBlock: '4px',
  borderBlockEnd: '1px solid rgba(0, 0, 0, 0.25)',
  ':hover': {
    backgroundColor: token('color.background.semantic.info.subtlest'),
  },
});

export const reloadButtonStyles = style({ marginInlineEnd: '8px' });
