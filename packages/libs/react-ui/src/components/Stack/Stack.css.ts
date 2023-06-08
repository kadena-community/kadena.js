import { sprinkles } from '../../styles';

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
]);

export const spacingClass = styleVariants({
  '2xs': [container, sprinkles({ gap: '2xs' })],
  xs: [container, sprinkles({ gap: 'xs' })],
  sm: [container, sprinkles({ gap: 'sm' })],
  md: [container, sprinkles({ gap: 'md' })],
  lg: [container, sprinkles({ gap: 'lg' })],

  xl: [container, sprinkles({ gap: 'xl' })],
  '2xl': [container, sprinkles({ gap: '2xl' })],
  '3xl': [container, sprinkles({ gap: '3xl' })],
});

export const justifyContentClass = styleVariants({
  flexStart: [container, sprinkles({ justifyContent: 'flex-start' })],
  center: [container, sprinkles({ justifyContent: 'center' })],
  flexEnd: [container, sprinkles({ justifyContent: 'flex-end' })],
  spaceBetween: [container, sprinkles({ justifyContent: 'space-between' })],
  spaceAround: [container, sprinkles({ justifyContent: 'space-around' })],
});

export const alignItemsClass = styleVariants({
  flexStart: [container, sprinkles({ alignItems: 'flex-start' })],
  center: [container, sprinkles({ alignItems: 'center' })],
  flexEnd: [container, sprinkles({ alignItems: 'flex-end' })],
  stretch: [container, sprinkles({ alignItems: 'stretch' })],
});

export const flexWrapClass = styleVariants({
  wrap: [container, sprinkles({ flexWrap: 'wrap' })],
  nowrap: [container, sprinkles({ flexWrap: 'nowrap' })],
});

export const directionClass = styleVariants({
  column: [container, sprinkles({ flexDirection: 'column' })],
  row: [container, sprinkles({ flexDirection: 'row' })],
});
