import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const modalOptionsContentStyle = style([
  atoms({
    width: '100%',
    fontSize: 'xs',
  }),
]);

export const titleTagStyle = style([
  atoms({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 'xs',
  }),
]);

export const modalButtonStyle = style([
  atoms({
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
    fontSize: 'xs',
  }),
]);

export const radioItemWrapperStyle = style([
  atoms({
    cursor: 'pointer',
  }),
]);
