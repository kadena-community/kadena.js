import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const homeWrapperClass = style([
  {
    paddingInlineEnd: tokens.kda.foundation.size.n16,
  },
]);

export const helpCenterButtonClass = style([
  atoms({
    color: 'text.brand.primary.default',
    cursor: 'pointer',
  }),
]);

export const infoBoxStyle = style([
  atoms({
    fontSize: 'sm',
    padding: 'sm',
    borderRadius: 'sm',
    display: 'flex',
    flexDirection: 'column',
  }),
]);

export const infoBoxStyle = style([
  sprinkles({
    fontSize: '$sm',
    padding: '$4',
    borderRadius: '$sm',
    display: 'flex',
    flexDirection: 'column',
  }),
]);
