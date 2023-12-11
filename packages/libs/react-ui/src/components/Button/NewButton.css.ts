import { createVar, keyframes, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { colorPalette } from '../../styles/colors';
import { tokens } from '../../styles/tokens/contract.css';
import { bodyBaseBold } from '../../styles/tokens/styles.css';
import { vars } from '../../styles/vars.css';

const hoverBackgroundColor = createVar();
const activeBackgroundColor = createVar();
const hoverColor = createVar();
const outlineColor = createVar();
const backgroundColor = createVar();
const color = createVar();

// TODO: use the new tokens once they are ready in the design system and figma is updated

// eslint-disable-next-line @kadena-dev/typedef-var
const colorVariants = {
  primary: {
    vars: {
      [color]: vars.colors.$primaryContrast,
      [backgroundColor]: vars.colors.$primarySurface,
      [hoverBackgroundColor]: vars.colors.$primaryHighContrast,
      [activeBackgroundColor]: vars.colors.$primaryHighContrast,
      [hoverColor]: vars.colors.$primaryContrast,
      [outlineColor]: vars.colors.$primaryAccent,
    },
  },
  secondary: {
    vars: {
      [color]: vars.colors.$secondaryContrast,
      [backgroundColor]: vars.colors.$secondarySurface,
      [hoverBackgroundColor]: vars.colors.$secondaryHighContrast,
      [activeBackgroundColor]: vars.colors.$secondaryHighContrast,
      [hoverColor]: vars.colors.$secondaryContrast,
      [outlineColor]: vars.colors.$secondaryAccent,
    },
  },
  tertiary: {
    vars: {
      [color]: vars.colors.$tertiaryContrast,
      [backgroundColor]: vars.colors.$tertiarySurface,
      [hoverBackgroundColor]: vars.colors.$tertiaryHighContrast,
      [activeBackgroundColor]: vars.colors.$tertiaryHighContrast,
      [hoverColor]: vars.colors.$tertiaryContrast,
      [outlineColor]: vars.colors.$tertiaryAccent,
    },
  },
  warning: {
    vars: {
      [color]: vars.colors.$warningContrast,
      [backgroundColor]: vars.colors.$warningSurface,
      [hoverBackgroundColor]: vars.colors.$warningHighContrast,
      [activeBackgroundColor]: vars.colors.$warningHighContrast,
      [hoverColor]: vars.colors.$warningContrast,
      [outlineColor]: vars.colors.$warningAccent,
    },
  },
  negative: {
    vars: {
      [color]: vars.colors.$negativeContrast,
      [backgroundColor]: vars.colors.$negativeSurface,
      [hoverBackgroundColor]: vars.colors.$negativeHighContrast,
      [activeBackgroundColor]: vars.colors.$negativeHighContrast,
      [hoverColor]: vars.colors.$negativeContrast,
      [outlineColor]: vars.colors.$negativeAccent,
    },
  },
  positive: {
    vars: {
      [color]: vars.colors.$positiveContrast,
      [backgroundColor]: vars.colors.$positiveSurface,
      [hoverBackgroundColor]: vars.colors.$positiveHighContrast,
      [activeBackgroundColor]: vars.colors.$positiveHighContrast,
      [hoverColor]: vars.colors.$positiveContrast,
      [outlineColor]: vars.colors.$positiveAccent,
    },
  },
  primaryInverted: {
    vars: {
      [color]: vars.colors.$primaryContrastInverted,
      [backgroundColor]: vars.colors.$primaryLowContrast,
      [hoverBackgroundColor]: vars.colors.$primarySurfaceInverted,
      [activeBackgroundColor]: vars.colors.$primaryHighContrast,
      [hoverColor]: vars.colors.$primaryContrastInverted,
      [outlineColor]: vars.colors.$primaryAccent,
    },
  },
  secondaryInverted: {
    vars: {
      [color]: vars.colors.$secondaryContrastInverted,
      [backgroundColor]: vars.colors.$secondaryLowContrast,
      [hoverBackgroundColor]: vars.colors.$secondarySurfaceInverted,
      [activeBackgroundColor]: vars.colors.$secondaryHighContrast,
      [hoverColor]: vars.colors.$secondaryContrastInverted,
      [outlineColor]: vars.colors.$secondaryAccent,
    },
  },
  tertiaryInverted: {
    vars: {
      [color]: vars.colors.$tertiaryContrastInverted,
      [backgroundColor]: vars.colors.$tertiaryLowContrast,
      [hoverBackgroundColor]: vars.colors.$tertiarySurfaceInverted,
      [activeBackgroundColor]: vars.colors.$tertiaryHighContrast,
      [hoverColor]: vars.colors.$tertiaryContrastInverted,
      [outlineColor]: vars.colors.$tertiaryAccent,
    },
  },
  warningInverted: {
    vars: {
      [color]: vars.colors.$warningContrastInverted,
      [backgroundColor]: vars.colors.$warningLowContrast,
      [hoverBackgroundColor]: vars.colors.$warningSurfaceInverted,
      [activeBackgroundColor]: vars.colors.$warningHighContrast,
      [hoverColor]: vars.colors.$warningContrastInverted,
      [outlineColor]: vars.colors.$warningAccent,
    },
  },
  positiveInverted: {
    vars: {
      [color]: vars.colors.$positiveContrastInverted,
      [backgroundColor]: vars.colors.$positiveLowContrast,
      [hoverBackgroundColor]: vars.colors.$positiveSurfaceInverted,
      [activeBackgroundColor]: vars.colors.$positiveHighContrast,
      [hoverColor]: vars.colors.$positiveContrastInverted,
      [outlineColor]: vars.colors.$positiveAccent,
    },
  },
  negativeInverted: {
    vars: {
      [color]: vars.colors.$negativeContrastInverted,
      [backgroundColor]: vars.colors.$negativeLowContrast,
      [hoverBackgroundColor]: vars.colors.$negativeSurfaceInverted,
      [activeBackgroundColor]: vars.colors.$negativeHighContrast,
      [hoverColor]: vars.colors.$negativeContrastInverted,
      [outlineColor]: vars.colors.$negativeAccent,
    },
  },
} as const;

export const button = recipe({
  base: [
    bodyBaseBold,
    {
      color,
      backgroundColor,
      position: 'relative',
      display: 'flex',
      placeItems: 'center',
      cursor: 'pointer',
      border: 'none',
      textDecoration: 'none',
      borderRadius: tokens.kda.foundation.radius.sm,
      gap: tokens.kda.foundation.size.n2,
      paddingInline: tokens.kda.foundation.size.n4,
      paddingBlock: tokens.kda.foundation.size.n2,
      outlineOffset: tokens.kda.foundation.border.width.normal,

      ':hover': {
        color: hoverColor,
        backgroundColor: hoverBackgroundColor,
      },
      ':active': {
        outlineStyle: 'solid',
        outlineWidth: tokens.kda.foundation.border.width.normal,
        outlineColor,
      },
      ':focus-visible': {
        outlineStyle: 'solid',
        outlineWidth: tokens.kda.foundation.border.width.normal,
        outlineColor,
      },
      ':disabled': {
        opacity: 0.7,
        backgroundColor: colorPalette.$gray60,
        color: colorPalette.$gray10,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
      transition:
        'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',
    },
  ],
  variants: {
    variant: colorVariants,
    isCompact: {
      true: {
        paddingInline: vars.sizes.$1,
        paddingBlock: vars.sizes.$1,
      },
    },
    isOutlined: {
      true: {
        backgroundColor: 'transparent',
        outlineOffset: 0,
        vars: {
          [backgroundColor]: 'none',
          [hoverBackgroundColor]: 'none',
        },
      },
    },
    isLoading: {
      true: {
        pointerEvents: 'none',
      },
    },
    onlyIcon: {
      true: {
        paddingInline: vars.sizes.$2,
        paddingBlock: vars.sizes.$2,
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
    isCompact: false,
    isOutlined: false,
  },
});

const rotate = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});

export const spinner = style({
  animationName: rotate,
  animationDuration: '1.5s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
});

export const cloak = style({
  visibility: 'hidden',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  inset: 0,
});
