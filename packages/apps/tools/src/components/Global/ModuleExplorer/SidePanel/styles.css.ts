import { atoms, token } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const containerStyle = style([
  atoms({
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
  }),
  style({
    borderInlineEnd: `${token('border.width.normal')} solid ${token('color.border.base.default')}`,
  }),
]);

export const itemStyle = style({
  height: token('size.n12'),
  borderBlockEnd: `${token('border.width.hairline')} solid ${token('color.border.base.default')}`,
  boxSizing: 'content-box',
});

export const headingStyles = style({
  flex: 1,
});

export const iconStyles = atoms({ paddingInlineStart: 'sm' });
