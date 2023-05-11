import { colorVars, sprinkles } from '../../styles';

import { createVar, style, styleVariants } from '@vanilla-extract/css';

const color = createVar(),
  inverseColor = createVar(),
  bgColor = createVar(),
  bgHoverColor = createVar(),
  focusOutlineColor = createVar(),
  disabledBackgroundColor = createVar();

export const container = style([
  sprinkles({
    display: 'flex',
    placeItems: 'center',
    gap: 1,
    borderRadius: 'sm',
    cursor: 'pointer',
    paddingX: 4,
    paddingY: 3,
    fontWeight: 'semiBold',
    color: 'neutral1',
  }),
  {
    color: color,
    background: bgColor,
    border: 0,
    transition: 'background-color 0.1s ease, color 0.1s ease',
    ':hover': {
      background: bgHoverColor,
    },
    ':active': {
      opacity: '0.8',
    },
    ':focus-visible': {
      // TODO figure out how to have tokens
      outlineOffset: '2px',
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: focusOutlineColor,
    },
    ':disabled': {
      opacity: 0.7,
      background: disabledBackgroundColor,
      color: inverseColor,
      cursor: 'not-allowed',
    },
  },
]);

export const buttonVariants = styleVariants({
  primaryFilled: [
    container,
    {
      vars: {
        [color]: colorVars.color.neutral1,
        [inverseColor]: colorVars.color.neutral6,
        [bgColor]: colorVars.color.primaryContrast,
        [bgHoverColor]: colorVars.color.primaryHighContrast,
        [focusOutlineColor]: colorVars.color.primaryHighContrast,
        [disabledBackgroundColor]: colorVars.color.neutral3,
      },
    },
  ],
  secondaryFilled: [
    container,
    {
      vars: {
        [color]: colorVars.color.neutral1,
        [inverseColor]: colorVars.color.neutral6,
        [bgColor]: colorVars.color.secondaryContrast,
        [bgHoverColor]: colorVars.color.secondaryHighContrast,
        [focusOutlineColor]: colorVars.color.secondaryHighContrast,
        [disabledBackgroundColor]: colorVars.color.neutral3,
      },
    },
  ],
});
