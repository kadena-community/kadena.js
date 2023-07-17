import { sprinkles } from '@theme/sprinkles.css';
import { ColorType, vars } from '@theme/vars.css';
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
    color: '$neutral5',
    borderRadius: '$sm',
  }),
  {
    border: `1px solid ${fallbackVar(contrastColor, vars.colors.$neutral6)}`,
    borderLeftWidth: vars.sizes.$1,
  },
]);

export const containerClassRightPadded = style([
  containerClass,
  sprinkles({
    paddingRight: '$xl',
  }),
]);

export const actionsContainerClass = style([
  sprinkles({
    marginY: '$md',
    display: 'flex',
    justifyContent: 'flex-start',
  }),
]);

export const expandVariants = styleVariants({
  true: [sprinkles({ width: '100%', maxWidth: '100%' })],
  false: [sprinkles({ width: 'max-content', maxWidth: 'maxContent' })],
});

export const cardTitleClass = style([
  sprinkles({
    marginBottom: '$sm',
  }),
  {
    color: contrastColor,
  },
]);

export const contentClass = style([
  sprinkles({
    marginY: '$md',
  }),
]);

const colors: Record<ColorType, ColorType> = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  info: 'info',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

export const colorVariants = styleVariants(colors, (color) => {
  return [
    sprinkles({
      backgroundColor: `$${color}Surface`,
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
    position: 'relative',
  }),
  {
    color: contrastColor,
    selectors: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
]);

export const iconContainerExpandedClass = style([
  iconContainerClass,
  sprinkles({
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

export const closeButtonClass = style([
  sprinkles({
    margin: 0,
    padding: 0,
    border: 'none',
    backgroundColor: 'transparent',
  }),
  {
    color: contrastColor,
    selectors: {
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
]);
