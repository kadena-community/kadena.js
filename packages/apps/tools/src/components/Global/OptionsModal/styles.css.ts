import { atoms } from '@kadena/kode-ui/styles';
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

export const modalWrapperStyle = style([
  atoms({
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
    fontSize: 'xs',
    marginBlockStart: 'md',
  }),
]);

export const modalButtonStyle = style([
  atoms({
    paddingInline: 'md',
  }),
]);

export const radioItemWrapperStyle = style([
  atoms({
    cursor: 'pointer',
  }),
]);
