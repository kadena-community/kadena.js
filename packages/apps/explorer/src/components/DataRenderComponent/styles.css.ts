import { atoms, token } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const sectionClass = style([
  atoms({
    padding: 'n6',
    marginBlockEnd: 'md',
  }),
  {
    backgroundColor: token('color.background.surface.default'),
  },
]);

export const headingClass = style([
  atoms({
    marginBlockEnd: 'sm',
  }),
]);
