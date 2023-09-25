import { sprinkles, vars } from '../../../styles';

import { createVar, fallbackVar, style } from '@vanilla-extract/css';

export const helperIconColor = createVar(),
  helperTextColor = createVar();

export const helperClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    fontSize: '$xs',
    marginY: '$3',
    color: '$foreground',
  }),
  {
    color: fallbackVar(helperTextColor, vars.colors.$primaryContrastInverted),
  },
]);

export const helperIconClass = style({
  color: fallbackVar(helperIconColor, vars.colors.$primaryAccent),
});
