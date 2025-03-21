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
  `${buttonGroupClass} ${buttonWrapperClass}:not(:last-child) button, ${buttonGroupClass} ${buttonWrapperClass}:not(:last-child) a`,
  {
    borderInlineEndWidth: '0',
  },
);

//fullwidth
globalStyle(
  `${buttonGroupClass}[data-fullwidth="true"] > span:not(:has(button[data-icononly="true"])):not(:has(a[data-icononly="true"])), ${buttonGroupClass}[data-fullwidth="true"] button:not([data-icononly="true"]),${buttonGroupClass}[data-fullwidth="true"] a:not([data-icononly="true"])`,
  {
    flex: 1,
    width: '100%',
  },
);
