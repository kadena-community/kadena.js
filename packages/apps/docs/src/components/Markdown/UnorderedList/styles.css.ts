import { sprinkles, vars } from '@kadena/react-ui/theme';

import { globalStyle, style } from '@vanilla-extract/css';

export const ulListClass = style([
  sprinkles({
    marginY: '$5',
    marginX: 0,
    position: 'relative',
  }),
]);

// should work, but doesn't
// globalStyle(`${ulListClass} li > ul`, {
globalStyle(`article ul > li >ul`, {
  paddingLeft: vars.sizes.$4,
  margin: 0,
  top: `calc(-1 * ${vars.sizes.$4})`,
  position: 'relative',
});
