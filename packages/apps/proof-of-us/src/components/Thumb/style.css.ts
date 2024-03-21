import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const attendanceThumbClass = style([
  atoms({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'secondaryFont.bold',
    fontSize: 'xl',
    marginInlineEnd: 'md',
  }),
  {
    width: '48px',
    aspectRatio: '1/1',
  },
]);

export const attendanceBackgroundClass = style([
  atoms({
    position: 'absolute',
  }),
  {
    width: '48px',
    aspectRatio: '1/1',
  },
]);
export const attendanceLoaderClass = style([
  atoms({
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  {
    width: '48px',
    aspectRatio: '1/1',
    zIndex: 1000,
  },
]);

export const connectThumbClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'secondaryFont.bold',
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
