import {
  createVar,
  fallbackVar,
  globalStyle,
  style,
  styleVariants,
} from '@vanilla-extract/css';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { recipe } from '@vanilla-extract/recipes';
import {
  atoms,
  monospaceBaseRegular,
  monospaceSmallRegular,
  monospaceSmallestRegular,
  token,
  uiBaseRegular,
  uiSmallRegular,
  uiSmallestRegular,
} from '../../styles';

export type InputVariants = NonNullable<RecipeVariants<typeof input>>;

// deprecated
export const statusColor = createVar();
export const statusOutlineColor = createVar();

export const outlineColor = createVar();
export const iconFill = fallbackVar(token('color.icon.base.@init'));
const backgroundColor = fallbackVar(token('color.background.input.default'));
const textColor = fallbackVar(token('color.text.base.@init'));

const outlineStyles = {
  outlineOffset: '3px',
  outlineStyle: `solid`,
  outlineWidth: '2px',
  outlineColor,
  borderRadius: token('radius.sm'),
};

export const baseContainerClass = recipe({
  base: [
    atoms({
      alignItems: 'stretch',
      display: 'flex',
      position: 'relative',
      width: '100%',
    }),
    {
      transition: 'outline-color 0.2s ease-in-out',
      outlineColor: 'transparent',
      backgroundColor,
      selectors: {
        // outline should not be shown if there is a button which is focused
        '&:focus-within:has(button:not(button:focus))': outlineStyles,
        '&:focus-within:not(&:has(button))': outlineStyles,
      },
    },
  ],
  variants: {
    variant: {
      default: {
        vars: {
          [outlineColor]: token('color.border.tint.outline'),
          [iconFill]: token('color.icon.base.default'),
        },
      },
      positive: {
        vars: {
          [outlineColor]: token('color.border.semantic.positive.default'),
          [iconFill]: token('color.icon.semantic.positive.default'),
        },
      },
      info: {
        vars: {
          [outlineColor]: token('color.border.semantic.info.default'),
          [iconFill]: token('color.icon.semantic.info.default'),
        },
      },
      negative: {
        vars: {
          [outlineColor]: token('color.border.semantic.negative.default'),
          [iconFill]: token('color.icon.semantic.negative.default'),
        },
      },
      warning: {
        vars: {
          [outlineColor]: token('color.border.semantic.warning.default'),
          [iconFill]: token('color.icon.semantic.warning.default'),
        },
      },
      readonly: {
        cursor: 'not-allowed',
        vars: {
          [iconFill]: token('color.icon.base.@disabled'),
          [backgroundColor]: token('color.background.input.@disabled'),
        },
      },
    },
  },
});

export const formField = atoms({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  gap: 'sm',
  flex: 1,
});

export const inputContainer = atoms({
  display: 'flex',
  flex: 1,
  position: 'relative',
  alignItems: 'stretch',
});

const baseStartAddon = style([
  atoms({
    position: 'absolute',
  }),
  {
    insetBlockStart: '50%',
    transform: 'translateY(-50%)',
    insetInlineStart: token('spacing.n3'),
    color: iconFill,
  },
]);

export const startAddon = styleVariants({
  sm: [baseStartAddon, { fontSize: '11px' }],
  md: [baseStartAddon, { fontSize: '13px' }],
  lg: [baseStartAddon, { fontSize: token('size.n4') }],
});

export const endAddon = style([
  atoms({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    backgroundColor: 'surface.default',
  }),
  {
    top: '50%',
    transform: 'translateY(-50%)',
  },
]);

globalStyle(`${endAddon}  button`, {
  height: '100%',
  borderRadius: '0',
});

export const input = recipe({
  base: [
    atoms({
      outline: 'none',
      flex: 1,
      borderRadius: 'no',
      paddingInlineStart: 'n4',
      border: 'none',
    }),
    {
      color: textColor,
      background: 'transparent',
      transition: 'box-shadow, background-color 0.2s ease-in-out',
      '::placeholder': {
        color: textColor,
      },
      selectors: {
        '&[data-focused]': {
          color: token('color.text.base.@focus'),
          vars: {
            [backgroundColor]: token('color.background.input.@focus'),
          },
        },
        '&[data-hovered]': {
          color: token('color.text.base.@hover'),
          vars: {
            [backgroundColor]: token('color.background.input.@hover'),
          },
        },
        '&[data-has-end-addon]': {
          paddingInlineEnd: `calc(var(--end-addon-width) + ${token(
            'spacing.n2',
          )})`,
        },
        '&[data-has-start-addon]': {
          paddingInlineStart: `calc(var(--start-addon-width) + ${token(
            'spacing.n5',
          )})`,
        },
        '&[data-disabled]': {
          pointerEvents: 'none',
          boxShadow: 'none',
          vars: {
            [textColor]: token('color.text.base.@disabled'),
          },
        },
      },
    },
  ],
  variants: {
    size: {
      sm: atoms({ paddingBlock: 'n2' }),
      md: atoms({ paddingBlock: 'n3' }),
      lg: atoms({ paddingBlock: 'n4' }),
    },
    fontType: {
      ui: uiSmallRegular,
      code: monospaceSmallRegular,
    },
    variant: {
      default: {
        boxShadow: `0 -1px 0 0 ${token('color.border.base.default')} inset`,
        vars: {
          [backgroundColor]: token('color.background.input.default'),
        },
      },
      positive: {
        boxShadow: `0 0 0 1px ${outlineColor} inset`,
        selectors: {
          '&[data-focused]': {
            boxShadow: 'none',
          },
        },
      },
      info: {
        boxShadow: `0 0 0 1px ${outlineColor} inset`,
        selectors: {
          '&[data-focused]': {
            boxShadow: 'none',
          },
        },
      },
      negative: {
        boxShadow: `0 0 0 1px ${outlineColor} inset`,
        selectors: {
          '&[data-focused]': {
            boxShadow: 'none',
          },
        },
      },
      warning: {
        boxShadow: `0 0 0 1px ${outlineColor} inset`,
        selectors: {
          '&[data-focused]': {
            boxShadow: 'none',
          },
        },
      },
      readonly: {
        boxShadow: `0 -1px 0 0 ${token('color.border.base.default')} inset`,
        pointerEvents: 'none',
        color: token('color.text.base.@disabled'),
        selectors: {
          '&::placeholder': {
            color: token('color.text.base.@disabled'),
          },
        },
        vars: {
          [backgroundColor]: 'transparent',
        },
      },
    },
  },
  compoundVariants: [
    {
      variants: {
        size: 'sm',
        fontType: 'ui',
      },
      style: uiSmallestRegular,
    },
    {
      variants: {
        size: 'md',
        fontType: 'ui',
      },
      style: uiSmallRegular,
    },
    {
      variants: {
        size: 'lg',
        fontType: 'ui',
      },
      style: uiBaseRegular,
    },
    {
      variants: {
        size: 'sm',
        fontType: 'code',
      },
      style: monospaceSmallestRegular,
    },
    {
      variants: {
        size: 'md',
        fontType: 'code',
      },
      style: monospaceSmallRegular,
    },
    {
      variants: {
        size: 'lg',
        fontType: 'code',
      },
      style: monospaceBaseRegular,
    },
  ],
});
