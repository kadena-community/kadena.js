import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const backButtonClass = style({
  border: 0,
  transform: 'rotate(90deg)',
  background: 'transparent',
  color: 'white',
  cursor: 'pointer',
});
export const closeButtonClass = style({
  border: 0,
  background: 'transparent',
  color: 'white',
  cursor: 'pointer',
});

export const imageWrapper = style([
  atoms({
    position: 'relative',
  }),
]);
export const titleInputClass = style([
  atoms({
    fontSize: '2xl',
  }),
  {
    top: '10px',
    left: '10px',
    zIndex: 2,
  },
]);
export const titleErrorClass = style([
  atoms({
    color: 'icon.semantic.warning.default',
  }),
]);
