import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const tagClass = style([
  atoms({
    display: 'flex',
    textTransform: 'uppercase',
    fontSize: 'xs',
    borderRadius: 'sm',
    paddingBlock: 'xxs',
    paddingInline: 'sm',
  }),
  {
    alignSelf: 'baseline',
  },
]);
