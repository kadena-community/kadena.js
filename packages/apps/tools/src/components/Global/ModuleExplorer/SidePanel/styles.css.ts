import { atoms } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerStyle = atoms({
  display: 'flex',
  flexDirection: 'column',
  overflow: 'scroll',
});

export const headingStyles = style({
  flex: 1,
});

export const iconStyles = atoms({ paddingInlineStart: 'sm' });
