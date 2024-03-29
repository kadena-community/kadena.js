import { deviceColors } from '@/styles/tokens.css';
import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const wrapperClass = style([
  atoms({
    position: 'relative',
  }),
  {},
]);

export const savedImageClass = style([
  atoms({
    position: 'absolute',
    width: '100%',
  }),
]);

export const imageClass = style([
  atoms({
    borderRadius: 'lg',
    width: '100%',
  }),
  {
    border: `2px solid ${deviceColors.borderColor}`,
  },
]);

export const imageWrapper = style([
  {
    position: 'relative',
    width: '100%',
    overflowY: 'hidden',
    aspectRatio: '1/1',
    zIndex: 2,
  },
]);
export const gradientClass = style([
  {
    position: 'absolute',
    bottom: '0',
    width: '100%',
    height: '80px',
    background: `linear-gradient(0deg, ${deviceColors.kadenaBlack}FF 5%, ${deviceColors.kadenaBlack}00 100%)`,
    zIndex: 2,
  },
]);
export const tagInfoWrapperClass = style([
  {
    position: 'absolute',
    top: '0',
    width: '100%',
    background: 'linear-gradient(180deg, #000 0%, rgba(0, 0, 0, 0.00) 91.67%)',
  },
]);
export const tagInfoClass = style([
  atoms({
    fontSize: 'xs',
    margin: 'sm',
    paddingBlock: 'sm',
    paddingInline: 'md',
  }),
  {
    flex: 1,
    backgroundColor: 'rgba(112, 83, 0, 0.20)',
    backdropFilter: 'blur(10px)',
    textShadow: `1px 1px 0 ${deviceColors.kadenaBlack}45`,
    borderRadius: '8px',
  },
]);

export const textStyle = style({ opacity: '.8' });
