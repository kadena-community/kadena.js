import { globalStyle, recipe, style } from './../../styles';

export const buttonGroupClass = style({});
export const buttonGroupRecipe = recipe({
  base: {},
  variants: {
    variant: {
      primary: {},
      transparent: {},
      info: {},
      warning: {},
      positive: {},
      negative: {},
      outlined: {},
    },
  },
});

export const buttonWrapperClass = style({});

globalStyle(
  `${buttonGroupClass} button:not(:first-child):not(:last-child), ${buttonGroupClass} a:not(:first-child):not(:last-child)`,
  {
    borderRadius: 0,
  },
);

globalStyle(
  `${buttonGroupClass} button:first-child, ${buttonGroupClass} a:first-child`,
  {
    borderEndEndRadius: 0,
    borderStartEndRadius: 0,
  },
);
globalStyle(
  `${buttonGroupClass} button:last-child, ${buttonGroupClass} a:last-child`,
  {
    borderEndStartRadius: 0,
    borderStartStartRadius: 0,
  },
);

globalStyle(
  `${buttonGroupClass} button:not(:last-child), ${buttonGroupClass} a:not(:last-child)`,
  {
    borderInlineEndWidth: '0',
  },
);

globalStyle(
  `${buttonGroupClass}[data-variant="outlined"] ${buttonWrapperClass}:not(:first-child) a:not(:has(button)), ${buttonGroupClass}[data-variant="outlined"] ${buttonWrapperClass}:not(:first-child) button`,
  {
    borderInlineStartWidth: '0px',
    borderStyle: 'solid',
  },
);
