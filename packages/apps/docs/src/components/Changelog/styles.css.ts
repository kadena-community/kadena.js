import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const commitsSectionClass = style([
  atoms({
    backgroundColor: 'surface.default',
  }),
]);

export const commitListClass = style([
  atoms({
    paddingInlineStart: 'lg',
  }),
]);
export const commitListItemClass = style([
  atoms({
    width: '100%',
    display: 'flex',
  }),
]);
