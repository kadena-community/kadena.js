import { sprinkles } from '../../styles';

import { style, styleVariants } from '@vanilla-extract/css';

export const container = style([
  sprinkles({
    display: 'flex',
  }),
]);

export const spacingClass = styleVariants({
  '2xs': [sprinkles({ gap: '2xs' })],
  xs: [sprinkles({ gap: 'xs' })],
  sm: [sprinkles({ gap: 'sm' })],
  md: [sprinkles({ gap: 'md' })],
  lg: [sprinkles({ gap: 'lg' })],

  xl: [sprinkles({ gap: 'xl' })],
  '2xl': [sprinkles({ gap: '2xl' })],
  '3xl': [sprinkles({ gap: '3xl' })],
});

export const justifyContentClass = styleVariants({
  'flex-start': [sprinkles({ justifyContent: 'flex-start' })],
  center: [sprinkles({ justifyContent: 'center' })],
  'flex-end': [sprinkles({ justifyContent: 'flex-end' })],
  'space-between': [sprinkles({ justifyContent: 'space-between' })],
  'space-around': [sprinkles({ justifyContent: 'space-around' })],
});

export const alignItemsClass = styleVariants({
  'flex-start': [sprinkles({ alignItems: 'flex-start' })],
  center: [sprinkles({ alignItems: 'center' })],
  'flex-end': [sprinkles({ alignItems: 'flex-end' })],
  stretch: [sprinkles({ alignItems: 'stretch' })],
});

export const flexWrapClass = styleVariants({
  wrap: [sprinkles({ flexWrap: 'wrap' })],
  nowrap: [sprinkles({ flexWrap: 'nowrap' })],
});

export const directionClass = styleVariants({
  column: [sprinkles({ flexDirection: 'column' })],
  row: [sprinkles({ flexDirection: 'row' })],
});
