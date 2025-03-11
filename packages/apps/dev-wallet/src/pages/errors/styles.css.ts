import { style } from '@kadena/kode-ui';
import { responsiveStyle, token } from '@kadena/kode-ui/styles';

export const warningIconColorClass = style({
  color: token('color.icon.semantic.negative.default'),
});

export const wrapperClass = style({
  ...responsiveStyle({
    xs: {},
    md: { marginBlockStart: '-80px' },
  }),
});
