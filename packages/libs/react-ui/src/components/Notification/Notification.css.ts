import { sprinkles } from '@theme/sprinkles.css';
import type { ColorType } from '@theme/vars.css';
import { vars } from '@theme/vars.css';
import { style, styleVariants } from '@vanilla-extract/css';

const colors: Record<ColorType, ColorType> = {
  info: 'info',
  positive: 'positive',
  warning: 'warning',
  negative: 'negative',
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
};

export const containerClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'flex-start',
    borderRadius: '$sm',
    padding: '$md',
    gap: '$md',
    borderStyle: 'solid',
    borderWidth: '$sm',
  }),
  {
    borderLeftWidth: vars.sizes.$1,
  },
]);

export const cardColorVariants = styleVariants(colors, (color) => {
  return [
    sprinkles({
      backgroundColor: `$${color}Surface`,
      borderColor: `$${color}Contrast`,
      color: `$${color}Contrast`,
    }),
  ];
});

export const expandVariants = styleVariants({
  true: [sprinkles({ width: '100%', maxWidth: '100%' })],
  false: [sprinkles({ width: 'max-content', maxWidth: 'maxContent' })],
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

export const descriptionClass = style([
  sprinkles({
    color: '$neutral6',
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

export const actionButtonClass = style([
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

export const actionButtonColorVariants = styleVariants(colors, (color) => {
  return [
    actionButtonClass,
    sprinkles({
      color: `$${color}Contrast`,
    }),
  ];
});
