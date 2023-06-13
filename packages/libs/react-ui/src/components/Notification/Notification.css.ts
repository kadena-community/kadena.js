import { ColorType, sprinkles, vars } from '../../styles';

import {
  createVar,
  fallbackVar,
  style,
  styleVariants,
} from '@vanilla-extract/css';

const contrastColor = createVar(),
  surfaceColor = createVar();

export const containerClass = style([
  sprinkles({
    borderWidth: 'md',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 'max-content',
    height: 'min-content',
    position: 'relative',
  }),
  {
    border: `1px solid ${fallbackVar(contrastColor, vars.colors.neutral6)}`,
    color: fallbackVar(contrastColor, vars.colors.neutral6),
    backgroundColor: fallbackVar(surfaceColor, vars.colors.neutral2),
    borderLeftWidth: vars.sizes['1'],
  },
]);

export const footerClass = style([
  sprinkles({
    marginY: 'md',
  }),
]);

export const expandClass = style([
  sprinkles({
    width: '100%',
  }),
  {
    width: '100% !important',
  },
]);

export const simpleClass = style([
  sprinkles({
    borderRadius: 'md',
    paddingRight: 'xl',
  }),
  {
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

export const colorVariants = styleVariants(
  {
    default: 'default',
    primary: 'primary',
    secondary: 'secondary',
    positive: 'positive',
    warning: 'warning',
    negative: 'negative',
  },
  (color) => {
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
  },
);

export const iconContainerClass = style([
  sprinkles({
    marginX: 'md',
    marginTop: 'sm',
    display: 'flex',
    right: 0,
    position: 'relative',
  }),
]);

export const iconContainerFullWidthClass = style([
  sprinkles({
    marginTop: 'sm',
    marginRight: 'md',
    display: 'flex',
    marginLeft: 'auto',
  }),
]);

export const headerContainerClass = style([
  sprinkles({
    margin: 0,
    padding: 0,
    width: 'min-content',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 'md',
    paddingLeft: 'md',
  }),
]);
