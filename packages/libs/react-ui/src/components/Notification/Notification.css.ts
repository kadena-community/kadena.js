import { sprinkles } from '@theme/sprinkles.css';
import type { ColorType } from '@theme/vars.css';
import { vars } from '@theme/vars.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const colorVariants: Omit<
  Record<ColorType, ColorType>,
  'secondary' | 'tertiary'
> = {
  info: 'info',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
  primary: 'primary',
};

export const containerClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'flex-start',
    padding: '$md',
    borderStyle: 'solid',
    justifyContent: 'center',
  }),
  {
    borderLeftWidth: vars.sizes.$1,
  },
]);

export const containerWrapperClass = style([
  sprinkles({
    padding: '$md',
    display: 'flex',
    width: '100%',
    alignItems: 'flex-start',
    gap: '$md',
  }),
  {
    maxWidth: 1440,
  },
]);

export const cardColorVariants = styleVariants(colorVariants, (color) => {
  return [
    sprinkles({
      backgroundColor: `$${color}SurfaceInverted`,
      borderColor: `$${color}ContrastInverted`,
      color: `$${color}ContrastInverted`,
    }),
  ];
});

export const expandVariants = styleVariants({
  true: [sprinkles({ width: '100%', maxWidth: '100%' })],
  false: [sprinkles({ width: 'max-content', maxWidth: 'maxContent' })],
});

export const displayVariants = styleVariants({
  outlined: [sprinkles({ borderWidth: '$sm', borderRadius: '$sm' })],
  standard: [sprinkles({ border: 'none', borderRadius: 0 })],
});

export const inlineVariants = styleVariants({
  true: [
    sprinkles({
      display: 'flex',
      alignItems: {
        md: 'flex-start',
      },
      flexDirection: {
        md: 'row',
      },
    }),
  ],
  false: [],
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
    display: 'flex',
    flexDirection: 'column',
    gap: '$xs',
    width: '100%',
  }),
  {
    marginTop: 2,
  },
]);

export const titleClass = style([
  sprinkles({
    color: 'inherit',
    fontSize: '$base',
    fontWeight: '$bold',
  }),
]);

export const descriptionClass = style([
  sprinkles({
    color: '$neutral6',
    fontSize: '$base',
  }),
]);

export const actionsContainerClass = style([
  sprinkles({
    marginTop: '$lg',
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '$12',
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
