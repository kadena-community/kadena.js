import { sprinkles } from '@theme/sprinkles.css';
import { style } from '@vanilla-extract/css';

export const imageClass = style([
  sprinkles({
    borderRadius: '$round',
    width: '$24',
    height: '$24',
    objectFit: 'cover',
  }),
]);

export const boldTextClass = style([
  sprinkles({
    marginY: '$2',
    fontWeight: '$bold',
    display: 'block',
  }),
]);

const ulClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginX: 0,
    marginY: '$2',
    padding: 0,
  }),
]);

export const tagContainerClass = style([
  ulClass,
  sprinkles({
    flexDirection: 'row',
    listStyleType: 'none',
  }),
]);

export const linkContainerClass = style([
  ulClass,
  sprinkles({
    flexDirection: 'column',
    marginLeft: '$4',
  }),
]);

export const tagClass = style([
  sprinkles({
    margin: '$1',
  }),
]);

export const containerClass = style([
  sprinkles({
    color: '$foreground',
    display: 'flex',
    flexDirection: 'row',
    gap: '$6',
  }),
]);
