import { createVar, style } from '@vanilla-extract/css';
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
export const iconFill = createVar();
const backgroundColor = createVar();

export const baseContainerClass = recipe({
  base: [
    atoms({
      alignItems: 'stretch',
      display: 'flex',
      color: 'text.base.@init',
      position: 'relative',
      width: '100%',
      backgroundColor: 'transparent',
    }),
    {
      transition: 'outline-color 0.2s ease-in-out',
      outlineColor: 'transparent',
      selectors: {
        '&:focus-within': {
          outlineOffset: '3px',
          outlineStyle: `solid`,
          outlineWidth: '2px',
          outlineColor,
          borderRadius: token('radius.sm'),
        },
      },
    },
  ],
  variants: {
    variant: {
      default: {
        vars: {
          [outlineColor]: token('color.border.tint.outline'),
        },
      },
      positive: {
        vars: {
          [outlineColor]: token('color.border.semantic.positive.default'),
        },
      },
      info: {
        vars: {
          [outlineColor]: token('color.border.semantic.info.default'),
        },
      },
      negative: {
        vars: {
          [outlineColor]: token('color.border.semantic.negative.default'),
        },
      },
      warning: {
        vars: {
          [outlineColor]: token('color.border.semantic.warning.default'),
        },
      },
      readonly: {
        cursor: 'not-allowed',
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
});

export const inputContainer = atoms({
  display: 'flex',
  flex: 1,
  position: 'relative',
  alignItems: 'stretch',
});

// Field shared css

export const startAddon = style({
  position: 'absolute',
  insetBlockStart: '50%',
  transform: 'translateY(-50%)',
  insetInlineStart: token('spacing.sm'),
});

export const endAddon = style({
  position: 'absolute',
  insetBlockStart: '50%',
  transform: 'translateY(-50%)',
  insetInlineEnd: token('spacing.sm'),
});

export const input = recipe({
  base: [
    atoms({
      color: 'text.base.default',
      outline: 'none',
      flex: 1,
      paddingInlineStart: 'n4',
      paddingInlineEnd: 'n4',
      paddingBlock: 'n2',
      borderRadius: 'no',
      border: 'none',
    }),
    {
      backgroundColor: backgroundColor,
      transition: 'box-shadow 0.2s ease-in-out',
      '::placeholder': {
        color: token('color.text.base.@init'),
      },
      selectors: {
        '&[data-has-end-addon]': {
          paddingInlineEnd: `calc(var(--end-addon-width) + ${token(
            'spacing.lg',
          )})`,
        },
        '&[data-has-start-addon]': {
          paddingInlineStart: `calc(var(--start-addon-width) + ${token(
            'spacing.lg',
          )})`,
        },
        '&[data-disabled]': {
          pointerEvents: 'none',
          color: token('color.text.base.@disabled'),
          vars: {
            [backgroundColor]: token('color.background.input.default'),
          },
        },
      },
    },
  ],
  variants: {
    size: {
      sm: {},
      md: {},
      lg: {},
    },
    fontType: {
      ui: uiSmallRegular,
      code: monospaceSmallRegular,
    },
    variant: {
      default: {
        boxShadow: `0 -1px 0 0 ${token('color.border.base.default')} inset`,
        vars: {
          [iconFill]: token('color.icon.base.default'),
          [backgroundColor]: token('color.background.input.default'),
        },
      },
      positive: {
        boxShadow: `0 0 0 1px ${token(
          'color.border.semantic.positive.default',
        )} inset`,
        selectors: {
          '&[data-focused]': {
            boxShadow: 'none',
          },
        },
        vars: {
          [iconFill]: token('color.icon.semantic.positive.default'),
        },
      },
      info: {
        boxShadow: `0 0 0 1px ${token(
          'color.border.semantic.info.default',
        )} inset`,
        selectors: {
          '&[data-focused]': {
            boxShadow: 'none',
          },
        },
        vars: {
          [iconFill]: token('color.icon.semantic.info.default'),
        },
      },
      negative: {
        boxShadow: `0 0 0 1px ${token(
          'color.border.semantic.negative.default',
        )} inset`,
        selectors: {
          '&[data-focused]': {
            boxShadow: 'none',
          },
        },
        vars: {
          [iconFill]: token('color.icon.semantic.negative.default'),
        },
      },
      warning: {
        boxShadow: `0 0 0 1px ${token(
          'color.border.semantic.warning.default',
        )} inset`,
        selectors: {
          '&[data-focused]': {
            boxShadow: 'none',
          },
        },
        vars: {
          [iconFill]: token('color.icon.semantic.warning.default'),
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
          [iconFill]: token('color.icon.base.@disabled'),
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
