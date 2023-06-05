import { sprinkles, vars } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
    display: 'flex',
    gap: 'md',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
  }),
  {},
]);
const spacingVariants: Record<string, string> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2xs': '2xs',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '2xl': '2xl',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '3xl': '3xl',
};

export const spacingClass = styleVariants(spacingVariants, (gap) => {
  return [
    container,
    {
      gap: vars.sizes[gap as keyof typeof vars.sizes],
    },
  ];
});

const justifyContentVariants: Record<string, string> = {
  'flex-start': 'flex-start',
  center: 'center',
  'flex-end': 'flex-end',
  'space-between': 'space-between',
  'space-around': 'space-around',
};

export const justifyContentClass = styleVariants(
  justifyContentVariants,
  (justify) => {
    return [
      container,
      {
        justifyContent: justify,
      },
    ];
  },
);

const alignItemsVariants: Record<string, string> = {
  'flex-start': 'flex-start',
  center: 'center',
  'flex-end': 'flex-end',
  stretch: 'stretch',
};

export const alignItemsClass = styleVariants(alignItemsVariants, (align) => {
  return [
    container,
    {
      alignItems: align,
    },
  ];
});

export const flexWrappedClass = style([
  sprinkles({
    flexWrap: 'wrap',
  }),
]);

export const directionColumnClass = style([
  sprinkles({
    flexDirection: 'column',
  }),
]);

// used for testing in storybook
export const Item = style([
  sprinkles({
    borderRadius: 'sm',
    backgroundColor: 'primarySurface',
    color: 'neutral6',
    size: 32,
  }),
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
]);

export const ItemSizeClass = styleVariants(vars.sizes, (size) => {
  return [
    Item,
    sprinkles({}),
    {
      width: size,
      height: size,
    },
  ];
});
