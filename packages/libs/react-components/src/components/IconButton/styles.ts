/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201
import { styled } from '../../styles';

export const colorVariant = {
  default: {
    background: 'transparent',
    $$svgColor: '$colors$neutral5',
  },
  inverted: {
    background: 'transparent',
    $$svgColor: '$colors$neutral2',
  },
  primary: {
    background: '$primarySurface',
    $$svgColor: '$colors$primaryHighContrast',
  },
  secondary: {
    background: '$secondarySurface',
    $$svgColor: '$colors$secondaryHighContrast',
  },
  positive: {
    background: '$positiveSurface',
    $$svgColor: '$colors$positiveHighContrast',
  },
  warning: {
    background: '$warningSurface',
    $$svgColor: '$colors$warningHighContrast',
  },
  negative: {
    background: '$negativeSurface',
    $$svgColor: '$colors$negativeHighContrast',
  },
} as const;

export const StyledButton = styled('button', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'transparent',
  borderRadius: '$lg',
  size: '$11',
  border: 0,
  cursor: 'pointer',
  transition: 'opacity .2s ease',
  '&:hover': {
    opacity: '.6',
  },
  '&:focus-visible': {
    outlineOffset: '2px',
    outline: '2px solid $$svgColor',
  },
  $$svgColor: 'inherit',
  svg: {
    color: '$$svgColor',
  },

  variants: {
    color: colorVariant,
  },

  defaultVariants: {
    color: 'default',
  },
});
