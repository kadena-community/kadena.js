import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const thumbWrapClass = style({
  filter: 'drop-shadow(1px 1px 3px rgba(255,255,255,0.3))',
});

export const eventThumbClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bodyFont.bold',
    fontSize: 'xl',
    marginInlineEnd: 'md',
  }),
  {
    borderRadius: '3px',
    width: '50px',
    aspectRatio: '1/1',
    clipPath:
      'path("M49.928,13.244c-0.062,-0.001 -0.124,-0.002 -0.186,-0.002c-6.333,0 -11.475,5.159 -11.475,11.514c0,6.354 5.142,11.513 11.475,11.513c0.062,0 0.124,-0 0.186,-0.001l0,13.759l-49.858,-0l0,-50.028l49.858,-0l0,13.245Z");',
  },
]);

export const connectThumbClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bodyFont.bold',
    fontSize: 'xl',
    marginInlineEnd: 'md',
  }),
  {
    borderRadius: '3px',
    width: '50px',
    aspectRatio: '1/1',
    backgroundRepeat: 'none',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
  },
]);
