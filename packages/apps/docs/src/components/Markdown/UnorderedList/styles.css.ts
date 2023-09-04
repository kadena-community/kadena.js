import { sprinkles, vars } from '@kadena/react-ui/theme';

import { globalStyle, style } from '@vanilla-extract/css';

export const ulListClassName = 'markdown-unordered-list';

export const ulListClass = style([
  sprinkles({
    marginY: '$5',
    marginX: 0,
    position: 'relative',
  }),
]);

globalStyle(`.${ulListClassName}  ul`, {
  marginTop: 0,
  marginBottom: 0,
});

globalStyle(`.${ulListClassName}  li::marker`, {
  color: vars.colors.$primaryHighContrast,
  fontWeight: vars.fontWeights.$bold,
});
