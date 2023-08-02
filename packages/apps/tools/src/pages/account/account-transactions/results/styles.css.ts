import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const headerButtonGroupClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '$2',
  }),
]);

export const filterItemClass = style([
  sprinkles({
    borderRadius: '$sm',
    paddingY: '$1',
    paddingX: '$2',
    marginLeft: '$2',
  }),
  {
    lineHeight: '1',
    display: 'inline-block',
    border: `1px solid ${vars.colors.$gray30}`,
  },
]);
