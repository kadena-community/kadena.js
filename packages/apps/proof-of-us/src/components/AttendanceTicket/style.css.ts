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
    maxWidth: '800px',
    aspectRatio: '16/9',
    background: 'green',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    maskImage: "url('/assets/attendance-mask-large.png')",
    maskRepeat: 'no-repeat',
    maskSize: '97%',
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

export const ticketBorderClass = style([
  atoms({
    position: 'absolute',
  }),
  {
    width: '97%',
    zIndex: 10,
  },
]);
