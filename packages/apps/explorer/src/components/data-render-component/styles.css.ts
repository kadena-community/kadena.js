import { atoms } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const sectionClass = style([
  atoms({
    padding: 'n6',
    backgroundColor: 'base.default',
    marginBlockEnd: 'md',
  }),
]);

export const headingClass = style([
  atoms({
    marginBlockEnd: 'sm',
  }),
]);
