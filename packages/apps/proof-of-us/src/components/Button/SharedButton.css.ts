import { customTokens } from '@/styles/tokens.css';
import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';

export const button = recipe({
  base: [
    atoms({
      borderRadius: 'xs',
      paddingBlock: 'sm',
      paddingInline: 'xl',
      fontWeight: 'headingFont.bold',
      fontSize: 'base',
      textDecoration: 'none',
      position: 'relative',
      border: 'none',
    }),
    {
      cursor: 'pointer',
      selectors: {
        '&:after': {
          pointerEvents: 'none',
          content: '',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: '1px',
          border: '1px solid transparent',
        },
      },
    },
  ],
  variants: {
    variant: {
      primary: {
        backgroundColor: customTokens.color.accent,
        color: tokens.kda.foundation.color.text.base.inverse.default,
      },
      secondary: {
        color: customTokens.color.buttonText,
        backgroundColor: customTokens.color.surface,
        backdropFilter: 'blur(18px)',
      },
      progress: {
        background: 'none',
        color: tokens.kda.foundation.color.text.base.inverse.default,
        ':before': {
          content: '',
          position: 'absolute',
          borderRadius: tokens.kda.foundation.radius.xs,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: customTokens.color.accent,
          zIndex: -1,
        },
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export const progressIndicator = style({
  position: 'absolute',
  // borderRadius: tokens.kda.foundation.radius.xs,
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: tokens.kda.foundation.color.neutral.n100,
  zIndex: -1,
  transition: 'left 0.2s ease-in-out',
});

export type Variants = Omit<
  NonNullable<RecipeVariants<typeof button>>,
  'onlyIcon'
>;
