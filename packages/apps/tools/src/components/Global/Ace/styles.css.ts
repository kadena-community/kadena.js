import { token } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const containerStyle = style({
  height: '100%',
  paddingBlockStart: token('spacing.sm'),
});

/*
 * <span> elements get a global style (which includes font-family) from the `react-ui` library, we
 * need to reset it here otherwise code in the editor won't be rendered as a monospace font.
 */
globalStyle(`${containerStyle} span`, { fontFamily: 'inherit !important' });
