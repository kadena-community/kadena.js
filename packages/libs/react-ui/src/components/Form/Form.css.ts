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
  breakpoints,
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
const textColor = fallbackVar(token('color.text.base.@init'));

export const outlineStyles = {
  outlineStyle: `solid`,
  outlineWidth: '2px',
  outlineOffset: '2px',
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
      minWidth: '150px',
      '@media': {
        [breakpoints.sm]: {
          maxWidth: '100%',
        },
        [breakpoints.md]: {
          maxWidth: '40rem',
        },
      },
      selectors: {
        // outline should not be shown if there is a button which is focused
        '&:focus-within:has(button:not(button:focus))': outlineStyles,
        '&:focus-within:not(&:has(button))': outlineStyles,
        [`&:focus-within:has(button#select-button)`]: outlineStyles,
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

// TODO: remove when all fields are updated
export const inputContainer = atoms({
  display: 'flex',
  flex: 1,
  position: 'relative',
  alignItems: 'stretch',
});

const startAddonBase = style([
  atoms({
    position: 'absolute',
  }),
  {
    insetInlineStart: token('spacing.n3'),
    color: iconFill,
  },
]);

export const startAddonStyles = styleVariants({
  inline: [
    startAddonBase,
    {
      top: token('spacing.n4'),
    },
  ],
  fullHeight: [
    startAddonBase,
    {
      insetBlockStart: '50%',
      transform: 'translateY(-50%)',
    },
  ],
});

export const startAddonSize = styleVariants({
  sm: { fontSize: '11px' },
  md: { fontSize: '13px' },
  lg: { fontSize: token('size.n4') },
});

const endAddonBase = style([
  atoms({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  }),
  {
    selectors: {
      [`&:has(button)`]: {
        backgroundColor: token('color.background.surface.default'),
      },
    },
  },
]);

export const endAddonStyles = styleVariants({
  inline: [
    endAddonBase,
    {
      top: token('spacing.n2'),
      right: token('spacing.n2'),
    },
  ],
  fullHeight: [
    endAddonBase,
    {
      top: '50%',
      height: '100%',
      transform: 'translateY(-50%)',
      right: 0,
    },
  ],
});

globalStyle(`${endAddonStyles.fullHeight} button`, {
  height: '100%',
  borderRadius: '0',
});

export const inputSizeVariants = {
  size: {
    sm: atoms({ paddingBlock: 'n2' }),
    md: atoms({ paddingBlock: 'n3' }),
    lg: atoms({ paddingBlock: 'n4' }),
  },
} as const;

export const inputFontTypeVariants = {
  fontType: {
    ui: uiSmallRegular,
    code: monospaceSmallRegular,
  },
} as const;

export const inputSizeCompoundVariants: {
  variants: {
    fontType: keyof (typeof inputFontTypeVariants)['fontType'];
    size: keyof (typeof inputSizeVariants)['size'];
  };
  style: string;
}[] = [
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
];

export const input = recipe({
  base: [
    atoms({
      outline: 'none',
      flex: 1,
      paddingInlineStart: 'n4',
      border: 'none',
    }),
    {
      backgroundColor: token('color.background.input.default'),
      borderRadius: '0',
      color: textColor,
      transition: 'box-shadow, background-color 0.2s ease-in-out',
      '::placeholder': {
        color: textColor,
      },
      selectors: {
        '&[data-focused]': {
          color: token('color.text.base.@focus'),
          boxShadow: 'none',
          backgroundColor: token('color.background.input.@focus'),
        },
        '&[data-hovered]': {
          color: token('color.text.base.@hover'),
          backgroundColor: token('color.background.input.@hover'),
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
    variant: {
      default: {
        boxShadow: `0 -1px 0 0 ${token('color.border.base.default')} inset`,
        backgroundColor: token('color.background.input.default'),
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
        backgroundColor: token('color.background.input.@disabled'),
        selectors: {
          '&::placeholder': {
            color: token('color.text.base.@disabled'),
          },
        },
      },
    },
    ...inputSizeVariants,
    ...inputFontTypeVariants,
  },
  compoundVariants: inputSizeCompoundVariants,
});
