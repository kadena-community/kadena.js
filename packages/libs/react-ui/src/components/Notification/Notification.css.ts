import { ColorType, sprinkles, vars } from '../../styles';

import { createVar, style, styleVariants } from '@vanilla-extract/css';

const contrastColor = createVar(),
  surfaceColor = createVar();

export const containerClass = style([
  sprinkles({
    borderWidth: 'md',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingX: '2xl',
  }),
  {
    width: 'max-content',
    height: 'min-content',
    border: `1px solid ${contrastColor}`,
    color: contrastColor,
    backgroundColor: surfaceColor,
    borderLeftWidth: vars.sizes['1'],
  },
]);

export const footerClass = style([
  sprinkles({
    marginY: 'md',
  }),
]);

export const expandClass = style([
  {
    width: '100%',
  },
]);

export const simpleClass = style([
  {
    borderRadius: vars.radii.md,
    borderLeftWidth: 1,
  },
]);

export const cardTitleClass = style([
  sprinkles({
    marginY: 'sm',
  }),
]);

export const contentClass = style([
  sprinkles({
    marginBottom: 'sm',
  }),
]);

export const simpleContentClass = style([
  sprinkles({
    marginY: 'md',
  }),
]);

// cannot use ColorType due to "default" having no go-to config
const colors: Record<string, string> = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

export const colorVariants = styleVariants(colors, (color) => {
  return [
    containerClass,
    {
      vars: {
        [contrastColor]:
          color === 'default'
            ? vars.colors.neutral6
            : vars.colors[`${color as ColorType}Contrast`],
        [surfaceColor]:
          color === 'default'
            ? vars.colors.neutral2
            : vars.colors[`${color as ColorType}Surface`],
      },
    },
  ];
});
