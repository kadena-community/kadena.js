import { globalStyle, recipe, style, token } from './../../../styles';

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

//variants
globalStyle(
  `${buttonGroupClass}[data-variant="primary"] button:not(:first-child), ${buttonGroupClass}[data-variant="primary"] a:not(:first-child)`,
  {
    border: 0,
    borderInlineStartWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'yellow',
  },
);

globalStyle(
  `${buttonGroupClass} button:not(:last-child), ${buttonGroupClass} a:not(:last-child)`,
  {
    borderInlineEndWidth: '0',
  },
);
