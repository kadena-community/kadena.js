import { sprinkles, vars } from '../../styles';

import { CSSProperties, style, styleVariants } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
    display: 'flex',
    gap: 'md',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
  }),
]);

const spacingVariants: Record<string, keyof typeof vars.sizes> = {
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
      gap: vars.sizes[gap],
    },
  ];
});

const justifyContentVariants: Record<string, CSSProperties['justifyContent']> =
  {
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

const alignItemsVariants: Record<string, CSSProperties['alignItems']> = {
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

const flexWrapVariants: Record<string, CSSProperties['flexWrap']> = {
  wrap: 'wrap',
  nowrap: 'nowrap',
};

export const flexWrapClass = styleVariants(flexWrapVariants, (wrap) => {
  return [
    container,
    {
      flexWrap: wrap,
    },
  ];
});

const directionColumnVariants: Record<string, CSSProperties['flexDirection']> =
  {
    column: 'column',
    row: 'row',
  };

export const directionClass = styleVariants(
  directionColumnVariants,
  (direction) => {
    return [
      container,
      {
        flexDirection: direction,
      },
    ];
  },
);
