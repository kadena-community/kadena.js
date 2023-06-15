import { ColorType, sprinkles, vars } from '../../styles';

import {
  createVar,
  fallbackVar,
  style,
  styleVariants,
} from '@vanilla-extract/css';

const contrastColor = createVar();

export const containerClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 'min-content',
    position: 'relative',
  }),
  {
    border: `1px solid ${fallbackVar(contrastColor, vars.colors.$neutral6)}`,
    borderLeftWidth: vars.sizes.$1,
  },
]);

export const footerClass = style([
  sprinkles({
    marginY: '$md',
  }),
]);

export const expandVariants = styleVariants(
  {
    true: true,
    false: false,
  },
  (expand) => {
    return [
      sprinkles({
        width: expand ? '100%' : 'max-content',
      }),
    ];
  },
);

export const simpleClass = style([
  sprinkles({
    borderRadius: '$md',
    paddingRight: '$xl',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }),
  {
    borderLeftWidth: 1,
  },
]);

export const cardTitleClass = style([
  sprinkles({
    marginBottom: '$sm',
  }),
]);

export const contentClass = style([
  sprinkles({
    marginY: '$md',
  }),
]);

export type ColorOptions = ColorType | 'default';

const colors: Record<ColorOptions, ColorOptions> = {
  default: 'default',
  primary: 'primary',
  secondary: 'secondary',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

export const colorVariants = styleVariants(colors, (color) => {
  if (color === 'default') {
    return [
      sprinkles({
        color: '$neutral6',
        backgroundColor: '$neutral2',
        borderColor: '$neutral6',
      }),
      {
        vars: {
          [contrastColor]: vars.colors.$neutral6,
        },
      },
    ];
  }

  return [
    sprinkles({
      backgroundColor: `$${color}Surface`,
      color: `$${color}Contrast`,
      borderColor: `$${color}Contrast`,
    }),
    {
      vars: {
        [contrastColor]: vars.colors[`$${color}Contrast`],
      },
    },
  ];
});

export const iconContainerClass = style([
  sprinkles({
    margin: '$md',
    display: 'flex',
    right: 0,
    position: 'relative',
  }),
]);

export const iconContainerExpandedClass = style([
  sprinkles({
    margin: '$md',
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
    marginRight: '$md',
    paddingLeft: '$md',
    position: 'absolute',
    top: '$md',
    right: '$xl',
  }),
]);
