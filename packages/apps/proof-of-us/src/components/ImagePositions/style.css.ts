import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const wrapperClass = style([
  atoms({
    position: 'relative',
  }),
]);
export const signeeClassWrapper = style([
  atoms({
    position: 'absolute',
    display: 'none',
    flexDirection: 'column',
    alignItems: 'center',
  }),
  {},
]);
export const signeeClass = style([
  atoms({
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  }),
  {
    width: '50px',
    aspectRatio: '1/1',
    backgroundColor: 'red',
    borderRadius: '50%',
    marginTop: '-25px',
    marginLeft: '-25px',
    border: 0,
  },
]);
export const signeeInputClass = style([
  atoms({
    position: 'absolute',
  }),
  {
    width: '150px',
    marginTop: '35px',
    marginLeft: '-25px',
  },
]);
