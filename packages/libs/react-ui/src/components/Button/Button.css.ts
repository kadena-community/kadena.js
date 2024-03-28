import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { atoms } from '../../styles/atoms.css';
import { token } from '../../styles/themeUtils';
import { tokens } from '../../styles/tokens/contract.css';
import { uiBaseBold, uiSmallestBold } from '../../styles/tokens/styles.css';

const textColor = createVar();
const backgroundColor = createVar();
const hoverBackgroundColor = createVar();
const disabledBackgroundColor = createVar();
const focusBackgroundColor = createVar();
const iconSize = createVar();
const iconFill = createVar();

const focus = {
  outline: `${tokens.kda.foundation.color.border.tint.outline} solid ${tokens.kda.foundation.border.width.normal}`,
  outlineOffset: tokens.kda.foundation.border.width.normal,
  backgroundColor: focusBackgroundColor,
};

export const iconStyle = style({
  fill: iconFill,
  height: iconSize,
  width: iconSize,
  transition: 'fill 0.2s ease-in-out',
});

export const disabledBadgeStyle = style({
  opacity: 0.4,
  transition: 'opacity 0.2s ease-in-out',
});

export const iconOnlyStyle = atoms({
  paddingInline: 'sm',
});

// spacing if there is a leading icon or avatar
const prefixIconSpacing = createVar();
export const prefixIconStyle = style({ marginInlineStart: prefixIconSpacing });

// spacing if there is a trailing icon
const postfixIconSpacing = createVar();
export const postfixIconStyle = style({
  marginInlineEnd: postfixIconSpacing,
});

// spacing if there is a trailing icon
const badgeSpacing = createVar();
export const badgeStyle = style({ marginInlineEnd: badgeSpacing });

// spacing if there is no prefix content
const noPrefixSpacing = createVar();
export const noPrefixStyle = style({ marginInlineStart: noPrefixSpacing });

// spacing if there is no postfix content
const noPostfixSpacing = createVar();
export const noPostfixStyle = style({ marginInlineEnd: noPostfixSpacing });

// spacing if there is an avatar
const avatarSpacing = createVar();
export const avatarStyle = style({
  marginInlineStart: avatarSpacing,
});

export const centerContentWrapper = style([
  atoms({ display: 'flex', alignItems: 'center', gap: 'sm' }),
  {
    fontFamily: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
  },
]);

export const buttonReset = style({
  position: 'relative',
  appearance: 'button',
  WebkitAppearance: 'button',
  paddingInline: 0,
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

const defaultVars = {
  [iconFill]: token('color.icon.base.@init'),
  [textColor]: token('color.text.base.@init'),
};

const defaultSelectors = {
  '&[data-hovered]': {
    vars: {
      [iconFill]: token('color.icon.base.@hover'),
      [textColor]: token('color.text.base.@hover'),
    },
  },
  '&[data-pressed]': {
    vars: {
      [iconFill]: token('color.icon.base.@active'),
      [textColor]: token('color.text.base.@active'),
    },
  },
  '&[data-focus-visible]': {
    vars: {
      [iconFill]: token('color.icon.base.@focus'),
      [textColor]: token('color.text.base.@focus'),
    },
  },
  '&[data-selected]': {
    vars: {
      [iconFill]: token('color.icon.base.@active'),
      [textColor]: token('color.text.base.@active'),
    },
  },
  '&[data-disabled]': {
    vars: {
      [backgroundColor]: 'transparent',
    },
  },
};

const inverseVars = {
  [iconFill]: token('color.icon.base.inverse.@init'),
  [textColor]: token('color.text.base.inverse.@init'),
};

const inverseSelectors = {
  '&[data-hovered]': {
    vars: {
      [iconFill]: token('color.icon.base.inverse.@hover'),
      [textColor]: token('color.text.base.inverse.@hover'),
    },
  },
  '&[data-pressed]': {
    vars: {
      [iconFill]: token('color.icon.base.inverse.@active'),
      [textColor]: token('color.text.base.inverse.@active'),
    },
  },
  '&[data-focus-visible]': {
    vars: {
      [iconFill]: token('color.icon.base.inverse.@focus'),
      [textColor]: token('color.text.base.inverse.@focus'),
    },
  },
  '&[data-selected]': {
    vars: {
      [iconFill]: token('color.icon.base.inverse.@active'),
      [textColor]: token('color.text.base.inverse.@active'),
    },
  },
  '&[data-disabled]': {
    vars: {
      [backgroundColor]: token('color.background.base.@disabled'),
    },
  },
};

export const button = recipe({
  base: [
    buttonReset,
    atoms({
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 'xs',
      gap: 'sm',
      paddingBlock: 'sm',
    }),
    {
      color: textColor,
      backgroundColor: backgroundColor,
      transition:
        'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',
      selectors: {
        '&[data-hovered]': {
          cursor: 'pointer',
          background: hoverBackgroundColor,
        },
        '&[data-pressed]': focus,
        '&[data-focus-visible]': focus,
        '&[data-selected]': focus,
        '&[data-disabled]': {
          cursor: 'not-allowed',
          vars: {
            [iconFill]: token('color.icon.base.@disabled'),
            [textColor]: token('color.text.base.@disabled'),
          },
        },
      },
    },
  ],
  variants: {
    variant: {
      primary: {
        vars: {
          [backgroundColor]: token(
            'color.background.accent.primary.inverse.default',
          ),
          [hoverBackgroundColor]: token(
            'color.background.accent.primary.inverse.@hover',
          ),
          [focusBackgroundColor]: token(
            'color.background.accent.primary.inverse.@focus',
          ),
          ...inverseVars,
        },
        selectors: {
          ...inverseSelectors,
        },
      },
      warning: {
        vars: {
          [backgroundColor]: token(
            'color.background.semantic.warning.inverse.default',
          ),
          [hoverBackgroundColor]: token(
            'color.background.semantic.warning.inverse.@hover',
          ),
          [focusBackgroundColor]: token(
            'color.background.semantic.warning.inverse.@focus',
          ),
          ...inverseVars,
        },
        selectors: {
          ...inverseSelectors,
        },
      },
      negative: {
        vars: {
          [backgroundColor]: token(
            'color.background.semantic.negative.inverse.default',
          ),
          [hoverBackgroundColor]: token(
            'color.background.semantic.negative.inverse.@hover',
          ),
          [focusBackgroundColor]: token(
            'color.background.semantic.negative.inverse.@focus',
          ),
          ...inverseVars,
        },
        selectors: {
          ...inverseSelectors,
        },
      },
      positive: {
        vars: {
          [backgroundColor]: token(
            'color.background.semantic.positive.inverse.default',
          ),
          [hoverBackgroundColor]: token(
            'color.background.semantic.positive.inverse.@hover',
          ),
          [focusBackgroundColor]: token(
            'color.background.semantic.positive.inverse.@focus',
          ),
          ...inverseVars,
        },
        selectors: {
          ...inverseSelectors,
        },
      },
      info: {
        vars: {
          [backgroundColor]: token(
            'color.background.semantic.info.inverse.default',
          ),
          [hoverBackgroundColor]: token(
            'color.background.semantic.info.inverse.@hover',
          ),
          [focusBackgroundColor]: token(
            'color.background.semantic.info.inverse.@focus',
          ),
          ...inverseVars,
        },
        selectors: {
          ...inverseSelectors,
        },
      },
      transparent: {
        vars: {
          [backgroundColor]: 'transparent',
          [hoverBackgroundColor]: token('color.background.base.@hover'),
          [disabledBackgroundColor]: 'transparent',
          [focusBackgroundColor]: token('color.background.base.@focus'),
          ...defaultVars,
        },
        selectors: {
          ...defaultSelectors,
        },
      },
      outlined: {
        boxShadow: `0px 0px 0px 1px ${token(
          'color.border.base.default',
        )} inset`,
        vars: {
          [backgroundColor]: 'transparent',
          [hoverBackgroundColor]: token('color.background.base.@hover'),
          [disabledBackgroundColor]: 'transparent',
          [focusBackgroundColor]: token('color.background.base.@focus'),
          ...defaultVars,
        },
        selectors: {
          ...defaultSelectors,
        },
      },
    },
    isCompact: {
      true: [
        uiSmallestBold,
        { lineHeight: token('size.n4') },
        {
          vars: {
            [iconSize]: token('size.n4'),
            [prefixIconSpacing]: token('size.n3'),
            [postfixIconSpacing]: token('size.n2'),
            [avatarSpacing]: token('size.n3'),
            [badgeSpacing]: token('size.n3'),
            [noPrefixSpacing]: token('size.n4'),
            [noPostfixSpacing]: token('size.n4'),
          },
        },
      ],
      false: [
        uiBaseBold,
        { lineHeight: token('size.n6') },
        {
          vars: {
            [iconSize]: token('size.n6'),
            [prefixIconSpacing]: token('size.n4'),
            [postfixIconSpacing]: token('size.n4'),
            [avatarSpacing]: token('size.n5'),
            [badgeSpacing]: token('size.n4'),
            [noPrefixSpacing]: token('size.n6'),
            [noPostfixSpacing]: token('size.n6'),
          },
        },
      ],
    },
    isLoading: {
      true: {
        pointerEvents: 'none',
      },
    },
  },
});
