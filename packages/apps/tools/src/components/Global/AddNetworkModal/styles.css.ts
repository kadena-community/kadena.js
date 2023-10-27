import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const modalOptionsContentStyle = style([
  sprinkles({
    width: '100%',
    paddingTop: '$xs',
  }),
]);

export const formButtonStyle = style([
  sprinkles({
    display: 'flex',
    marginTop: '$4',
    gap: '$8',
  }),
]);

export const errorMessageStyle = style([
  sprinkles({
    marginTop: '$md',
    color: '$red60',
  }),
]);
