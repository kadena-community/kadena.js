import { sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const inputContainerClass = style([
  sprinkles({
    display: 'flex',
    gap: '$4',
  }),
]);

export const accountNameContainerClass = style([{ flex: 1 }]);

export const chainSelectContainerClass = style([sprinkles({ width: '$25' })]);
