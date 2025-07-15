import { keyframes } from '@vanilla-extract/css';
import { recipe, token } from './../../styles';

const scaleWidthForwards = keyframes({
  '0%': {
    width: token('spacing.n6'),
    translate: `0px 0px`,
  },
  '50%': {
    width: token('spacing.n10'),
  },
  '90%': {
    width: token('spacing.n7'),
  },
  '100%': {
    width: token('spacing.n6'),
    translate: `${token('spacing.n8')} 0px`,
  },
});
const scaleWidthBackwards = keyframes({
  '0%': {
    width: token('spacing.n6'),
    translate: `${token('spacing.n8')} 0px`,
  },
  '50%': {
    width: token('spacing.n10'),
  },
  '90%': {
    width: token('spacing.n7'),
  },
  '100%': {
    width: token('spacing.n6'),
    translate: `0px 0px`,
  },
});

export const toggleButtonClass = recipe({
  base: {
    position: 'relative',
    height: token('spacing.n8'),
    width: token('spacing.n16'),
    borderRadius: token('radius.round'),
    padding: token('spacing.xs'),
    paddingInlineStart: token('spacing.sm'),
    alignItems: 'center',
    userSelect: 'none',
    WebkitUserSelect: 'none',
    border: 'none',
    willChange: 'color',
    transition: 'all 300ms ease',
    color: token('color.brand.key.white'),
    selectors: {
      '&:before': {
        content: '',
        display: 'inline-block',
        willChange: 'width',
        transition: 'all 300ms ease',
        top: token('spacing.n1'),
        left: token('spacing.n1'),
        position: 'absolute',
        backgroundColor: token('color.brand.key.white'),
        width: token('spacing.n6'),
        height: token('spacing.n6'),
        borderRadius: token('radius.round'),
      },
    },
  },

  variants: {
    isSelected: {
      true: {
        backgroundColor: token('color.accent.semantic.positive'),
        selectors: {
          '&:before': {
            animation: `${scaleWidthForwards} 300ms ease-in-out forwards`,
          },
        },
      },
      false: {
        backgroundColor: token('color.background.input.inverse.default'),
        selectors: {
          '&:before': {
            animation: `${scaleWidthBackwards} 300ms ease-in-out forwards`,
          },
        },
      },
    },
  },
});
