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
  height: '40px',
  // cursor: 'pointer',
  ':hover': {
    backgroundColor: token('color.background.semantic.info.subtlest'), //kda/foundation/color/background/semantic/info/subtlest
  },
  borderBlockEnd: '1px solid rgba(0, 0, 0, 0.25)',
});
