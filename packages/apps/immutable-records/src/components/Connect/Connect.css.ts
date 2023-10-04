import { sprinkles } from '@kadena/react-ui/theme';

import { globalStyle, style } from '@vanilla-extract/css';

export const container = style([sprinkles({})]);

export const debugContainerButton = style([
  sprinkles({
    marginTop: '$2',
  }),
]);

export const debugContainer = style([
  sprinkles({
    marginY: '$2',
    backgroundColor: '$gray40',
    borderColor: '$gray60',
    borderStyle: 'solid',
    borderWidth: '$md',
    padding: '$2',
  }),
  {
    display: 'inline-block',
  },
]);

export const tooltipContainer = style({});

globalStyle(`${tooltipContainer} div`, {
  zIndex: 2,
  backgroundColor: '#e88e00',
  borderColor: '#e88e00',
});
