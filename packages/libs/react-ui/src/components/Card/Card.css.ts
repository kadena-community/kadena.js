import { sprinkles, vars } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
    background: 'neutral2',
    color: 'neutral6',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingX: 'lg',
    paddingY: 'md',
    borderRadius: 'sm',
  }),
]);

const booleans: Record<string, boolean> = {
  true: true,
  false: false,
};

export const fullWidthVariant = styleVariants(booleans, (fullWidth) => {
  return [
    container,
    sprinkles({
      width: fullWidth ? 'full' : 'max-content',
    }),
  ];
});

export const stackVariant = styleVariants(booleans, (stack) => {
  const selectors = {
    '&:not(:last-child)': {
      borderBottom: `1px solid ${vars.colors.neutral3}`,
    },
    '&:first-child': {
      borderRadius: `${vars.radii.sm} ${vars.radii.sm} 0 0`,
    },
    '&:last-child': {
      borderRadius: `0 0 ${vars.radii.sm} ${vars.radii.sm}`,
    },
  };

  return [
    container,
    sprinkles(
      stack
        ? {
            marginY: 0,
          }
        : {
            marginY: 'md',
            borderRadius: 'sm',
            border: 'none',
          },
    ),
    {
      selectors: stack ? selectors : {},
    },
  ];
});
