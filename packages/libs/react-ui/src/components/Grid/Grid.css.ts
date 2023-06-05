import { sprinkles, vars } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const GridContainerClass = style([
  {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
  },
]);

export const GridItemClass = style([
  {
    gridColumnStart: 'auto',
  },
]);

const gaps: Record<string, string> = {
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

export const gapVariants = styleVariants(gaps, (gap) => {
  return [
    GridContainerClass,
    {
      gridGap: vars.sizes[gap as keyof typeof vars.sizes],
    },
  ];
});

// used in the stories
export const ContentClass = style([
  sprinkles({
    backgroundColor: 'primarySurface',
    borderRadius: 'sm',
    padding: 2,
    color: 'neutral6',
  }),
  {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
]);
