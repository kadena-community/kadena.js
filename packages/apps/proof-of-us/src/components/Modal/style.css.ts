import { deviceColors } from '@/styles/tokens.css';
import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const backgroundClass = style([
  atoms({
    position: 'fixed',
    inset: 0,
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
  }),
  {
    zIndex: 999,
    backgroundColor: `${deviceColors.kadenaBlack}ed`,
  },
]);

export const dialogWrapperClass = style([
  atoms({
    position: 'fixed',
    inset: 0,
    top: 0,
    left: 0,
  }),
  {
    pointerEvents: 'none',
    zIndex: 999,
  },
]);

export const dialogClass = style([
  atoms({
    borderRadius: 'md',
    padding: 'md',
  }),
  {
    width: '80%',
    maxWidth: '400px',
    border: `1px solid ${deviceColors.borderColor}`,
    backgroundColor: deviceColors.backgroundTransparentColor,
    backdropFilter: 'blur(10px)',
  },
]);

export const headerClass = style([
  atoms({
    fontSize: 'md',
    width: '100%',
    fontWeight: 'primaryFont.bold',
  }),
]);
