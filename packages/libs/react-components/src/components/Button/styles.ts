/* eslint @kadena-dev/typedef-var: 0 */
// TODO: Remove this when this issue is resolved: https://github.com/kadena-community/kadena.js/issues/201
import type * as Stitches from '@stitches/react';
import { styled } from '../../styles';

export const styleVariant = {
  primaryFilled: {
    $$color: '$colors$neutral1',
    $$inverseColor: '$colors$neutral6',
    $$bgColor: '$colors$primaryContrast',
    $$bgHoverColor: '$colors$primaryHighContrast',
    $$focusOutlineColor: '$colors$primaryHighContrast',
    $$disabledBackgroundColor: '$colors$neutral3',
  },
  secondaryFilled: {
    $$color: '$colors$neutral1',
    $$inverseColor: '$colors$neutral6',
    $$bgColor: '$colors$secondaryContrast',
    $$bgHoverColor: '$colors$secondaryHighContrast',
    $$focusOutlineColor: '$colors$secondaryHighContrast',
    $$disabledBackgroundColor: '$colors$neutral3',
  },
  positiveFilled: {
    $$color: '$colors$neutral1',
    $$inverseColor: '$colors$neutral6',
    $$bgColor: '$colors$positiveContrast',
    $$bgHoverColor: '$colors$positiveHighContrast',
    $$focusOutlineColor: '$colors$positiveHighContrast',
    $$disabledBackgroundColor: '$colors$neutral3',
  },
} as const;

export const StyledButton = styled('button', {
  display: 'inline-flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$1',
  transition: 'background-color 0.1s ease, color 0.1s ease',
  borderRadius: '$sm',
  cursor: 'pointer',
  border: 0,
  px: '$4',
  py: '$3',
  fontWeight: '$semiBold',
  color: '$$color',
  backgroundColor: '$$bgColor',
  textDecoration: 'none',
  '&:hover': {
    color: '$$color',
    backgroundColor: '$$bgHoverColor',
  },
  '&:active': {
    opacity: '0.8',
  },
  '&:focus-visible': {
    outlineOffset: '2px',
    outline: '2px solid $$focusOutlineColor',
  },
  '&:disabled': {
    opacity: 0.7,
    background: '$$disabledBackgroundColor',
    color: '$$inverseColor',
    cursor: 'not-allowed',
  },

  variants: {
    variant: styleVariant,
  },

  defaultVariants: {
    variant: 'primaryFilled',
  },
});

export type StyledButtonVariants = Stitches.VariantProps<typeof StyledButton>;
