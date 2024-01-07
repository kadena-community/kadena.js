import { atoms, sprinkles } from '@kadena/react-ui/theme';
import { style } from '@vanilla-extract/css';

export const containerClass = style([
  sprinkles({
    height: '100%',
    position: 'relative',
  }),
  {
    width: '680px',
  },
]);

export const notificationContainerStyle = style([
  atoms({ fontSize: 'xs', marginBlock: 'lg' }),
]);
