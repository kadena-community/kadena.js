import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const attendanceThumbClass = style([
  atoms({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bodyFont.bold',
    fontSize: 'xl',
    marginInlineEnd: 'md',
  }),
  {
    width: '48px',
    aspectRatio: '1/1',
  },
]);

export const connectThumbClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bodyFont.bold',
    fontSize: 'md',
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
