import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const ticketClass = style([
  atoms({
    borderRadius: 'md',
  }),
  {
    position: 'relative',
    width: '100vw',
    maxWidth: '800px',
    aspectRatio: '16/9',
    background: 'lightgrey',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    clipPath: 'url(#path)',
  },
]);
