import { sprinkles } from '@theme/sprinkles.css';
import type { ColorType } from '@theme/vars.css';
import { vars } from '@theme/vars.css';
import { createVar, style, styleVariants } from '@vanilla-extract/css';

const accentVar = createVar();

export const containerClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'flex-start',
    padding: '$sm',
    gap: '$sm',
    width: '100%',
  }),
]);

export const colorVariants: Omit<
  Record<ColorType, ColorType>,
  'secondary' | 'tertiary' | 'inverted' | 'primary'
> = {
  info: 'info',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
};

export const cardColorVariants = styleVariants(colorVariants, (color) => {
  return [
    sprinkles({
      backgroundColor: `$${color}SurfaceInverted`,
      borderColor: `$${color}ContrastInverted`,
      color: `$${color}ContrastInverted`,
    }),
    {
      vars: {
        [accentVar]: vars.colors[`$${color}ContrastInverted`],
      },
    },
  ];
});

export const displayVariants = styleVariants({
  bordered: [
    sprinkles({
      borderStyle: 'solid',
      borderWidth: '$sm',
      borderRadius: '$sm',
    }),
    {
      borderLeftWidth: vars.sizes.$1,
    },
  ],
  borderless: [],
});

export const closeButtonClass = style([
  sprinkles({
    marginLeft: 'auto',
    padding: 0,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    color: 'inherit',
  }),
]);

export const contentClass = style([
  sprinkles({
    color: '$neutral6',
    fontSize: '$base',
    gap: '$xs',
    maxWidth: '$maxContentWidth',
  }),
  {
    marginTop: 2,
  },
]);

export const titleClass = style([
  sprinkles({
    fontSize: '$base',
    fontWeight: '$bold',
    marginBottom: '$xs',
  }),
  {
    color: accentVar,
  },
]);

export const actionsContainerClass = style([
  sprinkles({
    marginTop: '$md',
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '$xl',
  }),
]);

const actionButtonClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    margin: 0,
    padding: 0,
    gap: '$3',
    fontSize: '$base',
    fontWeight: '$bold',
    cursor: 'pointer',
  }),
]);

export const actionButtonColorVariants = styleVariants(
  colorVariants,
  (color) => {
    return [
      actionButtonClass,
      sprinkles({
        color: `$${color}ContrastInverted`,
      }),
    ];
  },
);

export const iconClass = style([
  sprinkles({
    color: 'inherit',
    size: '$6',
  }),
]);
