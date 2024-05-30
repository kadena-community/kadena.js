import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
  }),
]);

export const headingStyles = style({
  flex: 1,
});
