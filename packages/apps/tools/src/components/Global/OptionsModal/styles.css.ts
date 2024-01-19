import { sprinkles } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const modalOptionsContentStyle = style([
  sprinkles({
    width: '100%',
    fontSize: '$xs',
  }),
]);

export const titleTagStyle = style([
  sprinkles({
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '$xs',
  }),
]);

export const modalButtonStyle = style([
  sprinkles({
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
    fontSize: '$xs',
  }),
]);

export const radioItemWrapperStyle = style([
  sprinkles({
    cursor: 'pointer',
  }),
]);
