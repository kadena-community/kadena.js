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

export const spacingClass = styleVariants(
  {
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
  } as Record<string, keyof typeof vars.sizes>,
  (gap) => {
    return [
      container,
      sprinkles({
        gap,
      }),
    ];
  },
);

export const justifyContentClass = styleVariants(
  {
    'flex-start': 'flex-start',
    center: 'center',
    'flex-end': 'flex-end',
    'space-between': 'space-between',
    'space-around': 'space-around',
  },
  (justify) => {
    return [
      container,
      {
        justifyContent: justify,
      },
    ];
  },
);

export const alignItemsClass = styleVariants(
  {
    'flex-start': 'flex-start',
    center: 'center',
    'flex-end': 'flex-end',
    stretch: 'stretch',
  },
  (align) => {
    return [
      container,
      {
        alignItems: align,
      },
    ];
  },
);

export const flexWrapClass = styleVariants(
  {
    wrap: 'wrap',
    nowrap: 'nowrap',
  } as Record<string, CSSProperties['flexWrap']>,
  (wrap) => {
    return [
      container,
      {
        flexWrap: wrap,
      },
    ];
  },
);

export const directionClass = styleVariants(
  {
    column: 'column',
    row: 'row',
  } as Record<string, CSSProperties['flexDirection']>,
  (direction) => {
    return [
      container,
      {
        flexDirection: direction,
      },
    ];
  },
);
