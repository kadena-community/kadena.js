import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const copyButtonClass = style([
  sprinkles({
    border: 'none',
    background: 'none',
    padding: '$1',
    cursor: 'pointer',
  }),
]);
