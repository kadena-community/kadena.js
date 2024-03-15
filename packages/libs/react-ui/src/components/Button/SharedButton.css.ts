import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { atoms } from '../../styles/atoms.css';
import { token } from '../../styles/themeUtils';
import { tokens } from '../../styles/tokens/contract.css';
import { bodyBaseBold } from '../../styles/tokens/styles.css';
import { iconFill } from '../Icon/IconWrapper.css';

// to reduce the number of local vars and make the code easier we use two colors and swap them for different variants

// used for the button background color in the base variant
const bg = createVar();
const bgHover = createVar();

// used for the button text color in the contained variant
const fg = createVar();
const fgHover = createVar();

const focusColor = createVar();

// eslint-disable-next-line @kadena-dev/typedef-var
const colorVariants = {
  primary: {
    vars: {
      [fg]: token('color.text.base.inverse.default'),
      [fgHover]: token('color.text.base.inverse.@hover'),
      [bg]: token('color.background.accent.primary.inverse.default'),
      [bgHover]: token('color.background.accent.primary.inverse.@hover'),
      [focusColor]: token('color.background.accent.primary.inverse.default'),
      [iconFill]: token('color.icon.base.inverse.default'),
    },
  },
  secondary: {
    vars: {
      [fg]: token('color.text.brand.secondary.inverse.default'),
      [fgHover]: token('color.text.brand.secondary.inverse.@hover'),
      [bg]: token('color.background.brand.secondary.inverse.default'),
      [bgHover]: token('color.background.brand.secondary.inverse.@hover'),
      [focusColor]: token('color.border.brand.secondary.@focus'),
      [iconFill]: token('color.icon.brand.secondary.default'),
    },
  },
  warning: {
    vars: {
      [fg]: token('color.text.semantic.warning.inverse.default'),
      [fgHover]: token('color.text.semantic.warning.inverse.@hover'),
      [bg]: token('color.background.semantic.warning.inverse.default'),
      [bgHover]: token('color.background.semantic.warning.inverse.@hover'),
      [focusColor]: token('color.border.semantic.warning.@focus'),
      [iconFill]: token('color.icon.semantic.warning.default'),
    },
  },
  negative: {
    vars: {
      [fg]: token('color.text.semantic.negative.inverse.default'),
      [fgHover]: token('color.text.semantic.negative.inverse.@hover'),
      [bg]: token('color.background.semantic.negative.inverse.default'),
      [bgHover]: token('color.background.semantic.negative.inverse.@hover'),
      [focusColor]: token('color.border.semantic.negative.@focus'),
      [iconFill]: token('color.icon.semantic.negative.default'),
    },
  },
  positive: {
    vars: {
      [fg]: token('color.text.semantic.positive.inverse.default'),
      [fgHover]: token('color.text.semantic.positive.inverse.@hover'),
      [bg]: token('color.background.semantic.positive.inverse.default'),
      [bgHover]: token('color.background.semantic.positive.inverse.@hover'),
      [focusColor]: token('color.border.semantic.positive.@focus'),
      [iconFill]: token('color.icon.semantic.positive.default'),
    },
  },
  info: {
    vars: {
      [fg]: token('color.text.semantic.info.inverse.default'),
      [fgHover]: token('color.text.semantic.info.inverse.@hover'),
      [bg]: token('color.background.semantic.info.inverse.default'),
      [bgHover]: token('color.background.semantic.info.inverse.@hover'),
      [focusColor]: token('color.background.semantic.info.inverse.default'),
      [iconFill]: token('color.icon.semantic.info.default'),
    },
  },
} as const;

// eslint-disable-next-line @kadena-dev/typedef-var
const focusRing = {
  outline: `${focusColor} solid ${tokens.kda.foundation.border.width.normal}`,
  outlineOffset: tokens.kda.foundation.border.width.normal,
};

export const buttonReset = style({
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
  cursor: 'pointer',
  textDecoration: 'none',
  isolation: 'isolate',
  border: 'none',
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

const typographyReset = {
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  lineHeight: 'inherit',
  letterSpacing: 'inherit',
};

export const button = recipe({
  base: [
    buttonReset,
    bodyBaseBold,
    atoms({
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 'md',
      gap: 'xs',
    }),
    {
      background: 'none',
      fontFamily: token('typography.family.primaryFont'),
      border: `${tokens.kda.foundation.border.width.normal} solid transparent`,
      transition:
        'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',
      selectors: {
        '&[data-hovered]': {
          cursor: 'pointer',
        },
        '&[data-pressed]': focusRing,
        '&[data-focus-visible]': focusRing,
        '&[data-selected]': focusRing,
        '&[data-disabled]': {
          background: token('color.background.base.@disabled'),
          color: token('color.text.base.@disabled'),
          cursor: 'not-allowed',
          pointerEvents: 'none',
          vars: {
            [iconFill]: token('color.icon.base.@disabled'),
          },
        },
      },
    },
  ],
  variants: {
    color: colorVariants,
    variant: {
      contained: {
        background: bg,
        color: fg,
        transition:
          'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',
        selectors: {
          '&[data-hovered]': {
            color: fgHover,
            background: bgHover,
          },
        },
        vars: {
          [iconFill]: fg,
        },
      },
      alternative: {
        color: bg,
        background: fg,
        selectors: {
          '&[data-hovered]': {
            background: fgHover,
            color: bgHover,
          },
        },
      },
      outlined: {
        border: `${token('border.width.normal')} solid ${fg}`,
        outline: 'none',
        color: bg,
        background: 'none',
        selectors: {
          '&[data-hovered]': {
            borderColor: fgHover,
          },
          '&[data-pressed]': {
            borderColor: focusColor,
            outline: 'none',
          },
          '&[data-selected]': {
            borderColor: focusColor,
            outline: 'none',
          },
          '&[data-focus-visible]': {
            borderColor: focusColor,
            outline: 'none',
          },
          '&[data-disabled]': {
            borderColor: token('color.border.base.@disabled'),
            color: token('color.text.base.@disabled'),
            background: 'none',
          },
        },
      },
      text: {
        background: 'none',
        color: bg,

        selectors: {
          'a&': typographyReset,
          '&[data-hovered]': {
            color: bgHover,
            textDecoration: 'underline',
          },
          '&[data-pressed]': {
            color: focusColor,
            textDecoration: 'underline',
            outline: 'none',
          },
          '&[data-selected]': {
            color: focusColor,
            textDecoration: 'underline',
            outline: 'none',
          },
          '&[data-focus-visible]': {
            color: focusColor,
            textDecoration: 'underline',
            outline: 'none',
          },
          '&[data-disabled]': {
            background: 'none',
          },
        },
      },
    },
    isCompact: {
      true: atoms({ padding: 'xs' }),
      false: atoms({ padding: 'sm' }),
    },
    isLoading: {
      true: {
        pointerEvents: 'none',
      },
    },
  },
  defaultVariants: {
    variant: 'contained',
    color: 'primary',
    isCompact: false,
  },
});
