import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { atoms } from '../../styles/atoms.css';
import { tokens } from '../../styles/tokens/contract.css';
import { bodyBaseBold } from '../../styles/tokens/styles.css';

const hoverBackgroundColor = createVar();
const activeBackgroundColor = createVar();
const hoverColor = createVar();
const outlineColor = createVar();
const backgroundColor = createVar();
const color = createVar();

// variables for the outlined variant
const borderColor = createVar();
const borderHoverColor = createVar();
const borderActiveColor = createVar();

// eslint-disable-next-line @kadena-dev/typedef-var
const colorVariants = {
  primary: {
    vars: {
      [color]: tokens.kda.foundation.color.text.brand.primary.inverse.default,
      [backgroundColor]:
        tokens.kda.foundation.color.background.brand.primary.inverse.default,
      [hoverBackgroundColor]:
        tokens.kda.foundation.color.background.brand.primary.inverse['@hover'],
      [activeBackgroundColor]:
        tokens.kda.foundation.color.background.brand.primary.inverse['@focus'],
      [hoverColor]:
        tokens.kda.foundation.color.text.brand.primary.inverse['@hover'],
      [outlineColor]:
        tokens.kda.foundation.color.border.brand.primary['@focus'],
      [borderColor]: tokens.kda.foundation.color.border.brand.primary.subtle,
      [borderHoverColor]:
        tokens.kda.foundation.color.border.brand.primary['@hover'],
      [borderActiveColor]:
        tokens.kda.foundation.color.border.brand.primary['@focus'],
    },
  },
  secondary: {
    vars: {
      [color]: tokens.kda.foundation.color.text.brand.secondary.inverse.default,
      [backgroundColor]:
        tokens.kda.foundation.color.background.brand.secondary.inverse.default,
      [hoverBackgroundColor]:
        tokens.kda.foundation.color.background.brand.secondary.inverse[
          '@hover'
        ],
      [activeBackgroundColor]:
        tokens.kda.foundation.color.background.brand.secondary.inverse[
          '@focus'
        ],
      [hoverColor]:
        tokens.kda.foundation.color.text.brand.secondary.inverse['@hover'],
      [outlineColor]:
        tokens.kda.foundation.color.border.brand.secondary['@focus'],
      [borderColor]: tokens.kda.foundation.color.border.brand.secondary.subtle,
      [borderHoverColor]:
        tokens.kda.foundation.color.border.brand.secondary['@hover'],
      [borderActiveColor]:
        tokens.kda.foundation.color.border.brand.secondary['@focus'],
    },
  },
  warning: {
    vars: {
      [color]:
        tokens.kda.foundation.color.text.semantic.warning.inverse.default,
      [backgroundColor]:
        tokens.kda.foundation.color.background.semantic.warning.inverse.default,
      [hoverBackgroundColor]:
        tokens.kda.foundation.color.background.semantic.warning.inverse[
          '@hover'
        ],
      [activeBackgroundColor]:
        tokens.kda.foundation.color.background.semantic.warning.inverse[
          '@focus'
        ],
      [hoverColor]:
        tokens.kda.foundation.color.text.semantic.warning.inverse['@hover'],
      [outlineColor]:
        tokens.kda.foundation.color.border.semantic.warning['@focus'],
      [borderColor]: tokens.kda.foundation.color.border.semantic.warning.subtle,
      [borderHoverColor]:
        tokens.kda.foundation.color.border.semantic.warning['@hover'],
      [borderActiveColor]:
        tokens.kda.foundation.color.border.semantic.warning['@focus'],
    },
  },
  negative: {
    vars: {
      [color]:
        tokens.kda.foundation.color.text.semantic.negative.inverse.default,
      [backgroundColor]:
        tokens.kda.foundation.color.background.semantic.negative.inverse
          .default,
      [hoverBackgroundColor]:
        tokens.kda.foundation.color.background.semantic.negative.inverse[
          '@hover'
        ],
      [activeBackgroundColor]:
        tokens.kda.foundation.color.background.semantic.negative.inverse[
          '@focus'
        ],
      [hoverColor]:
        tokens.kda.foundation.color.text.semantic.negative.inverse['@hover'],
      [outlineColor]:
        tokens.kda.foundation.color.border.semantic.negative['@focus'],
      [borderColor]:
        tokens.kda.foundation.color.border.semantic.negative.subtle,
      [borderHoverColor]:
        tokens.kda.foundation.color.border.semantic.negative['@hover'],
      [borderActiveColor]:
        tokens.kda.foundation.color.border.semantic.negative['@focus'],
    },
  },
  positive: {
    vars: {
      [color]:
        tokens.kda.foundation.color.text.semantic.positive.inverse.default,
      [backgroundColor]:
        tokens.kda.foundation.color.background.semantic.positive.inverse
          .default,
      [hoverBackgroundColor]:
        tokens.kda.foundation.color.background.semantic.positive.inverse[
          '@hover'
        ],
      [activeBackgroundColor]:
        tokens.kda.foundation.color.background.semantic.positive.inverse[
          '@focus'
        ],
      [hoverColor]:
        tokens.kda.foundation.color.text.semantic.positive.inverse['@hover'],
      [outlineColor]:
        tokens.kda.foundation.color.border.semantic.positive['@focus'],
      [borderColor]:
        tokens.kda.foundation.color.border.semantic.positive.subtle,
      [borderHoverColor]:
        tokens.kda.foundation.color.border.semantic.positive['@hover'],
      [borderActiveColor]:
        tokens.kda.foundation.color.border.semantic.positive['@focus'],
    },
  },
  primaryAlternative: {
    vars: {
      [color]: tokens.kda.foundation.color.text.brand.primary.default,
      [backgroundColor]:
        tokens.kda.foundation.color.background.brand.primary.default,
      [hoverBackgroundColor]:
        tokens.kda.foundation.color.background.brand.primary['@hover'],
      [activeBackgroundColor]:
        tokens.kda.foundation.color.background.brand.primary['@focus'],
      [hoverColor]: tokens.kda.foundation.color.text.brand.primary['@hover'],
      [outlineColor]:
        tokens.kda.foundation.color.border.brand.primary['@focus'],
    },
  },
  secondaryAlternative: {
    vars: {
      [color]: tokens.kda.foundation.color.text.brand.secondary.default,
      [backgroundColor]:
        tokens.kda.foundation.color.background.brand.secondary.default,
      [hoverBackgroundColor]:
        tokens.kda.foundation.color.background.brand.secondary['@hover'],
      [activeBackgroundColor]:
        tokens.kda.foundation.color.background.brand.secondary['@focus'],
      [hoverColor]: tokens.kda.foundation.color.text.brand.secondary['@hover'],
      [outlineColor]:
        tokens.kda.foundation.color.border.brand.secondary['@focus'],
    },
  },
  warningAlternative: {
    vars: {
      [color]: tokens.kda.foundation.color.text.semantic.warning.default,
      [backgroundColor]:
        tokens.kda.foundation.color.background.semantic.warning.default,
      [hoverBackgroundColor]:
        tokens.kda.foundation.color.background.semantic.warning['@hover'],
      [activeBackgroundColor]:
        tokens.kda.foundation.color.background.semantic.warning['@focus'],
      [hoverColor]: tokens.kda.foundation.color.text.semantic.warning['@hover'],
      [outlineColor]:
        tokens.kda.foundation.color.border.semantic.warning['@focus'],
    },
  },
  positiveAlternative: {
    vars: {
      [color]: tokens.kda.foundation.color.text.semantic.positive.default,
      [backgroundColor]:
        tokens.kda.foundation.color.background.semantic.positive.default,
      [hoverBackgroundColor]:
        tokens.kda.foundation.color.background.semantic.positive['@hover'],
      [activeBackgroundColor]:
        tokens.kda.foundation.color.background.semantic.positive['@focus'],
      [hoverColor]:
        tokens.kda.foundation.color.text.semantic.positive['@hover'],
      [outlineColor]:
        tokens.kda.foundation.color.border.semantic.positive['@focus'],
    },
  },
  negativeAlternative: {
    vars: {
      [color]: tokens.kda.foundation.color.text.semantic.negative.default,
      [backgroundColor]:
        tokens.kda.foundation.color.background.semantic.negative.default,
      [hoverBackgroundColor]:
        tokens.kda.foundation.color.background.semantic.negative['@hover'],
      [activeBackgroundColor]:
        tokens.kda.foundation.color.background.semantic.negative['@focus'],
      [hoverColor]:
        tokens.kda.foundation.color.text.semantic.negative['@hover'],
      [outlineColor]:
        tokens.kda.foundation.color.border.semantic.negative['@focus'],
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
      borderRadius: 'md',
      gap: 'xs',
      padding: 'sm',
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
          backgroundColor:
            tokens.kda.foundation.color.background.base['@disabled'],
          color: tokens.kda.foundation.color.text.base['@disabled'],
          cursor: 'not-allowed',
          pointerEvents: 'none',
        },
      },
    },
  ],
  variants: {
    variant: colorVariants,
    isCompact: {
      true: [atoms({ padding: 'xs' })],
    },
    isOutlined: {
      true: {
        borderWidth: tokens.kda.foundation.border.width.normal,
        borderColor: borderColor,
        borderStyle: 'solid',
        outlineStyle: 'none',
        outlineWidth: 0,
        outlineOffset: 0,
        outlineColor: 'transparent',
        vars: {
          [backgroundColor]: 'transparent',
          [hoverBackgroundColor]: 'transparent',
          [outlineColor]: 'transparent',
        },
        selectors: {
          '&[data-hovered]': {
            borderColor: borderHoverColor,
          },
          '&[data-pressed]': {
            borderColor: borderActiveColor,
          },
          '&[data-focus-visible]': {
            borderColor: borderActiveColor,
          },
          '&[data-disabled]': {
            borderColor: tokens.kda.foundation.color.border.base['@disabled'],
          },
        },
      },
    },
    isLoading: {
      true: {
        pointerEvents: 'none',
      },
    },
    onlyIcon: {
      true: [atoms({ padding: 'sm' })],
    },
  },
  defaultVariants: {
    variant: 'primary',
    isCompact: false,
    isOutlined: false,
  },
});
