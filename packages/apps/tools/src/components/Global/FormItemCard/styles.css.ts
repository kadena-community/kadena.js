import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const helperStyle = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'row-reverse',
    gap: '$1',
    cursor: 'pointer',
    color: '$neutral5',
    fontSize: '$xs',
  }),
]);

export const helperTextIconStyle = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
    cursor: 'pointer',
    color: '$neutral5',
  }),
]);

export const helperButtonIconStyle = style([
  sprinkles({
    outline: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  }),
]);
