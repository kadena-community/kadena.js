import { createVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { atoms } from '../../styles/atoms.css';
import { token } from '../../styles/themeUtils';
import { tokens } from '../../styles/tokens/contract.css';
import { uiBaseBold, uiSmallestBold } from '../../styles/tokens/styles.css';

const backgroundColor = createVar();
const textColor = createVar();
const hoverTextColor = createVar();
const hoverBackgroundColor = createVar();
const disabledBackgroundColor = createVar();
const focusBackgroundColor = createVar();
const iconSize = createVar();
const iconFill = createVar();

//FIXME: change the color token to border.tint.outline
const focus = {
  outline: `${tokens.kda.foundation.color.accent.blue} solid ${tokens.kda.foundation.border.width.normal}`,
  outlineOffset: tokens.kda.foundation.border.width.normal,
  backgroundColor: focusBackgroundColor,
};

export const iconStyle = style({
  fill: iconFill,
  height: iconSize,
  width: iconSize,
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
export const avatarStyle = style({ marginInlineStart: avatarSpacing });

export const centerContentWrapper = style([
  atoms({ display: 'flex', alignItems: 'center', gap: 'sm' }),
  {
    fontFamily: 'inherit',
    fontSize: 'inherit',
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
      backgroundColor: backgroundColor,
      color: textColor,
      transition:
        'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out',
      selectors: {
        '&[data-hovered]': {
          cursor: 'pointer',
          color: hoverTextColor,
          background: hoverBackgroundColor,
        },
        '&[data-pressed]': focus,
        '&[data-focus-visible]': focus,
        '&[data-selected]': focus,
        '&[data-disabled]': {
          background: disabledBackgroundColor,
          color: token('color.text.base.@disabled'),
          cursor: 'not-allowed',
          vars: {
            [iconFill]: token('color.icon.base.@disabled'),
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
          [textColor]: token('color.text.base.inverse.default'),
          [hoverTextColor]: token('color.text.base.inverse.@hover'),
          [hoverBackgroundColor]: token(
            'color.background.accent.primary.inverse.@hover',
          ),
          [iconFill]: token('color.text.base.inverse.default'),
          [disabledBackgroundColor]: token('color.background.base.@disabled'),
          [focusBackgroundColor]: token(
            'color.background.accent.primary.inverse.@focus',
          ),
        },
      },
      warning: {
        vars: {
          [backgroundColor]: token(
            'color.background.semantic.warning.inverse.default',
          ),
          [textColor]: token('color.text.semantic.warning.inverse.default'),
          [hoverTextColor]: token('color.text.semantic.warning.inverse.@hover'),
          [hoverBackgroundColor]: token(
            'color.background.semantic.warning.inverse.@hover',
          ),
          [iconFill]: token('color.icon.semantic.warning.default'),
          [disabledBackgroundColor]: token('color.background.base.@disabled'),
          [focusBackgroundColor]: token(
            'color.background.semantic.warning.inverse.@focus',
          ),
        },
      },
      negative: {
        vars: {
          [backgroundColor]: token(
            'color.background.semantic.negative.inverse.default',
          ),
          [textColor]: token('color.text.semantic.negative.inverse.default'),
          [hoverTextColor]: token(
            'color.text.semantic.negative.inverse.@hover',
          ),
          [hoverBackgroundColor]: token(
            'color.background.semantic.negative.inverse.@hover',
          ),
          [iconFill]: token('color.icon.semantic.negative.default'),
          [disabledBackgroundColor]: token('color.background.base.@disabled'),
          [focusBackgroundColor]: token(
            'color.background.semantic.negative.inverse.@focus',
          ),
        },
      },
      positive: {
        vars: {
          [backgroundColor]: token(
            'color.background.semantic.positive.inverse.default',
          ),
          [textColor]: token('color.text.semantic.positive.inverse.default'),
          [hoverTextColor]: token(
            'color.text.semantic.positive.inverse.@hover',
          ),
          [hoverBackgroundColor]: token(
            'color.background.semantic.positive.inverse.@hover',
          ),
          [iconFill]: token('color.icon.semantic.positive.default'),
          [disabledBackgroundColor]: token('color.background.base.@disabled'),
          [focusBackgroundColor]: token(
            'color.background.semantic.positive.inverse.@focus',
          ),
        },
      },
      info: {
        vars: {
          [backgroundColor]: token(
            'color.background.semantic.info.inverse.default',
          ),
          [textColor]: token('color.text.semantic.info.inverse.default'),
          [hoverTextColor]: token('color.text.semantic.info.inverse.@hover'),
          [hoverBackgroundColor]: token(
            'color.background.semantic.info.inverse.@hover',
          ),
          [iconFill]: token('color.icon.semantic.info.default'),
          [disabledBackgroundColor]: token('color.background.base.@disabled'),
          [focusBackgroundColor]: token(
            'color.background.semantic.info.inverse.@focus',
          ),
        },
      },
      transparent: {
        vars: {
          [backgroundColor]: 'transparent',
          [textColor]: token('color.text.base.default'),
          [hoverTextColor]: token('color.text.base.@hover'),
          [hoverBackgroundColor]: token('color.background.base.@hover'),
          [iconFill]: token('color.icon.semantic.info.default'),
          [disabledBackgroundColor]: 'transparent',
          [focusBackgroundColor]: token('color.background.base.@focus'),
        },
      },
      outlined: {
        boxShadow: `0px 0px 0px 1px ${token(
          'color.border.base.default',
        )} inset`,
        selectors: {
          '&[data-hovered]': {
            borderColor: token('color.border.base.@hover'),
          },
        },
        vars: {
          [backgroundColor]: 'transparent',
          [textColor]: token('color.text.base.default'),
          [hoverTextColor]: token('color.text.base.@hover'),
          [hoverBackgroundColor]: token('color.background.base.@hover'),
          [iconFill]: token('color.icon.base.@focus'),
          [disabledBackgroundColor]: 'transparent',
          [focusBackgroundColor]: token('color.background.base.@focus'),
        },
      },
    },
    isCompact: {
      true: [
        uiSmallestBold,
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
