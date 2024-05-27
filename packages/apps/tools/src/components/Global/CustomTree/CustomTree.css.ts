import { ellipsis, token } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

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
  // fontFamily: token('typography.family.monospaceFont'),
});

export const itemContainerStyle = style({
  // cursor: 'pointer',
});
