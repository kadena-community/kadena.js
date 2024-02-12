import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const ticketWrapClass = style({
  filter: 'drop-shadow(4px 4px 4px rgba(255,255,255,0.7))',
});

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

export const titleClass = style([
  atoms({
    fontSize: '3xl',
  }),
  {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
]);
