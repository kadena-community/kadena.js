import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { atoms } from '../../styles/atoms.css';
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

// eslint-disable-next-line @kadena-dev/typedef-var
const focusRing = {
  outlineColor,
  outlineStyle: 'solid',
  outlineWidth: tokens.kda.foundation.border.width.normal,
  outlineOffset: tokens.kda.foundation.border.width.normal,
};

const buttonReset = style({
  position: 'relative',
  appearance: 'button',
  WebkitAppearance: 'button',
  /* Remove the inheritance of text transform on button in Edge, Firefox, and IE. */
  textTransform: 'none',
  WebkitFontSmoothing: 'antialiased',
  /* Font smoothing for Firefox */
  MozOsxFontSmoothing: 'grayscale',
  verticalAlign: 'top',
  /* prevent touch scrolling on buttons */
  touchAction: 'none',
  userSelect: 'none',
  cursor: 'default',
  textDecoration: 'none',
  isolation: 'isolate',
  border: 'none',
  margin: 0,
  ':focus': {
    outline: 'none',
  },
  ':focus-visible': {
    zIndex: 3,
  },
  selectors: {
    /* Fix Firefox */
    '&::-moz-focus-inner': {
      border: 0,
      /* Remove the inner border and padding for button in Firefox. */
      borderStyle: 'none',
      padding: 0,
      /* Use uppercase PX so values don't get converted to rem */
      marginBlockStart: '-2PX',
      marginBlockEnd: '-2PX',
    },
  },
});
export const button = recipe({
  base: [
    buttonReset,
    bodyBaseBold,
    atoms({
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 'sm',
      gap: 'sm',
      paddingInline: 'md',
      paddingBlock: 'sm',
    }),
    {
      color,
      backgroundColor,
      transition:
        'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',

      selectors: {
        '&[data-hovered]': {
          color: hoverColor,
          backgroundColor: hoverBackgroundColor,
        },
        '&[data-pressed]': focusRing,
        '&[data-focus-visible]': focusRing,
        '&[data-disabled]': {
          opacity: 0.7,
          backgroundColor: colorPalette.$gray60,
          color: colorPalette.$gray10,
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
      },
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
