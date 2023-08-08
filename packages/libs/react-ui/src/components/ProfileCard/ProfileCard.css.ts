import { sprinkles } from '@theme/sprinkles.css';
import { style } from '@vanilla-extract/css';

export const imageContainerClass = style([
  sprinkles({
    borderRadius: '$round',
    overflow: 'hidden',
    width: '100%',
  }),
]);

export const imageClass = style([
  sprinkles({
    width: '100%',
    height: '100%',
    borderRadius: '$round',
  }),
  {
    objectFit: 'cover',
  },
]);

export const boldTextClass = style([
  sprinkles({
    marginTop: '$1',
    fontWeight: '$bold',
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
  }),
  {
    listStyleType: 'none',
  },
]);

export const linkContainerClass = style([
  ulClass,
  sprinkles({
    flexDirection: 'column',
    marginLeft: '$4',
  }),
  {},
]);

export const linkClass = style([
  sprinkles({
    color: '$blue80',

    textDecoration: 'none',
  }),
  {
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
]);

export const tagClass = style([
  sprinkles({
    margin: '$1',
  }),
]);

export const profileCardClass = style([
  sprinkles({
    color: '$foreground',
  }),
]);
