import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const cardClass = style([
  sprinkles({
    paddingX: '$10',
    paddingY: '$6',
    borderRadius: '$sm',
    marginRight: '$4',
    marginBottom: '$4',
  }),
  {
    border: `1px solid ${vars.colors.$gray30}`,
    flex: 'calc(50% - 40px)',
  },
]);
export const cardSectionClass = style([
  sprinkles({
    display: 'flex',
  }),
  {
    flexWrap: 'wrap',
  },
]);
