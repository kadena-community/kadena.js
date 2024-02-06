import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const floatClass = style([
  atoms({
    position: 'fixed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bodyFont.bold',
    fontSize: '2xl',
  }),
  {
    bottom: '2rem',
    right: '2rem',
    border: 0,
    background: 'green',
    borderRadius: '50%',
    width: '50px',
    aspectRatio: '1/1',
    textDecoration: 'none',

    selectors: {
      '&:hover': {
        opacity: '.8',
      },
    },
  },
]);
