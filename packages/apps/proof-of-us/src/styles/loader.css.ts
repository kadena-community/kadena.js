import { token } from '@kadena/kode-ui/styles';
import { keyframes, style } from '@vanilla-extract/css';

const animation = keyframes({
  to: {
    transform: `rotate(360deg) scale(0.5);`,
  },
});

const pulse = keyframes({
  from: {
    transform: `scale(1)`,
  },
  to: {
    transform: `scale(.8)`,
  },
});

export const kadenaSpinner = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: 'Kode Mono',
  width: '6rem',
  height: '6rem',
});

export const kadenaSpinnerDiv = style({
  position: 'absolute',
  width: '4rem',
  height: '4rem',
  borderRadius: '50%',
});

export const kadenaSpinnerDivDot = style([
  kadenaSpinnerDiv,
  {
    width: '1rem',
    height: '1rem',
    backgroundColor: token('color.brand.key.primary'),
    animation: `1s ${pulse} infinite alternate`,
  },
]);

export const kadenaSpinnerDivRing = style([
  kadenaSpinnerDiv,
  {
    borderWidth: '0.2rem',
    borderStyle: 'solid',
    borderColor: 'transparent',
    animation: `2s ${animation} infinite alternate`,

    selectors: {
      '&:nth-child(1)': {
        borderLeftColor: token('color.brand.key.primary'),
        borderRightColor: token('color.brand.key.primary'),
      },
      '&:nth-child(2)': {
        borderTopColor: token('color.brand.key.primary'),
        borderBottomColor: token('color.brand.key.primary'),
        animationDelay: '.8s',
        borderWidth: '0.2rem',
      },
    },
  },
]);
