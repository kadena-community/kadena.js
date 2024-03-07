import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const toggleContainerStyle = style([
  atoms({
    display: 'flex',
    alignItems: 'flex-end',
  }),
]);
export const labelStyle = style([
  atoms({
    position: 'relative',
    display: 'inline-block',
  }),
  {
    width: '60px',
    height: '30px',
  },
]);

export const inputStyle = style([
  {
    width: 0,
    height: 0,
    opacity: 0,
  },
]);

export const spanStyle = style([
  atoms({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    cursor: 'pointer',
  }),
  {
    transition: '0.3s',
    background: '#2c3e50',
    borderRadius: '30px',
    selectors: {
      ['&:before']: {
        position: 'absolute',
        content: '',
        height: '25px',
        width: '25px',
        left: '3px',
        bottom: '2.6px',
        backgroundColor: '#FFFFFF',
        borderRadius: '50%',
        transition: '0.3s',
      },
      '&.isToggled': {
        backgroundColor: tokens.kda.foundation.color.palette.blue.n30,
      },
      '&.isToggled:before': {
        transform: 'translateX(29px)',
      },
    },
  },
]);

export const strongStyle = style([
  atoms({
    cursor: 'pointer',
    marginInlineStart: 'md',
  }),
  {
    width: 'max-content',
    lineHeight: '30px',
  },
]);
