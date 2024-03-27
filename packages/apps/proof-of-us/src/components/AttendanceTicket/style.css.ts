import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const ticketClass = style([
  atoms({
    borderRadius: 'md',
    position: 'relative',
  }),
  {
    aspectRatio: '16/9',
    background: 'transparent',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    maskImage: "url('/assets/attendance-mask-large.svg')",
    maskRepeat: 'no-repeat',
    maskSize: '100%',
  },
]);

export const titleClass = style([
  atoms({
    position: 'absolute',
    fontWeight: 'headingFont.bold',
    textTransform: 'capitalize',
  }),
  {
    top: 'clamp(.5rem, 5vw, 2rem)',
    left: 'clamp(.4rem, 6.5vw, 3rem)',
    width: '65vw',
    fontSize: 'clamp(.5rem, 5vw, 2rem)',
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
    width: '100%',
    zIndex: 10,
  },
]);

export const dateWrapperClass = style([
  atoms({
    position: 'absolute',
    fontWeight: 'headingFont.regular',
    textTransform: 'capitalize',
  }),
  {
    bottom: 'clamp(.5rem, 5vw, 2rem)',
    left: 'clamp(.4rem, 6.5vw, 3rem)',
    width: '65vw',
    fontSize: 'clamp(.5rem, 5vw, 2rem)',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
]);

export const dateTitleClass = style([
  atoms({
    fontWeight: 'headingFont.bold',
    textTransform: 'capitalize',
    paddingBlockEnd: 'no',
  }),
  {
    fontSize: 'clamp(.5rem, 3vw, 1.5rem)',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
]);

export const dateClass = style([
  atoms({
    fontFamily: 'codeFont',
    fontWeight: 'headingFont.regular',
    textTransform: 'capitalize',
  }),
  {
    fontSize: 'clamp(.5rem, 3vw, 1.5rem)',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
]);
