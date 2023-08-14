import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const figure = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginX: '$5',
    marginY: 0,
    width: '100%',
    position: 'relative',
  }),
]);

export const figureImg = style([
  sprinkles({
    height: '100%',
  }),
]);

export const figCaption = style([
  sprinkles({
    textAlign: 'center',
  }),
]);
