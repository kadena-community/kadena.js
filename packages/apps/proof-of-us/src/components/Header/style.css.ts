import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const headerClass = style([
  atoms({
    position: 'sticky',
    paddingBlock: 'md',
    display: 'flex',
    top: 0,
  }),
  {
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
]);

export const logoWrapperClass = style([
  atoms({
    flex: 1,
  }),
]);

export const WrapperClass = style([
  atoms({
    paddingInline: 'md',
    paddingBlock: 'sm',
  }),
  {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: '0 auto',
  },
]);
