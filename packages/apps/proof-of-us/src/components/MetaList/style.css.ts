import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const metalistClass = style([
  atoms({
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  }),
]);
export const metatermClass = style([
  atoms({
    textTransform: 'capitalize',
    paddingBlock: 'xs',
  }),
  {
    width: '50%',
  },
]);
export const metadetailsClass = style([
  atoms({
    textTransform: 'capitalize',
    paddingBlock: 'xs',
  }),
  {
    width: '50%',
  },
]);
