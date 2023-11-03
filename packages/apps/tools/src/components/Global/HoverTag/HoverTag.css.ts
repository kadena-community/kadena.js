import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const iconButtonClass = style([
  sprinkles({
    border: 'none',
    background: 'none',
    padding: '$1',
    cursor: 'pointer',
  }),
]);

export const containerClass = style([sprinkles({ display: 'flex' })]);
