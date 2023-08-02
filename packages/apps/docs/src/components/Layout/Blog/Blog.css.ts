import { sprinkles, vars } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const bottomWrapperClass = style([
  sprinkles({
    width: '100%',
    paddingTop: '$20',
    marginTop: '$20',
  }),
  {
    borderTop: `1px solid ${vars.colors.$borderDefault}`,
  },
]);

export const articleTopMetadataClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginBottom: '$5',
    paddingX: 0,
    paddingY: '$5',
  }),
  {
    borderBottom: `1px solid ${vars.colors.$borderDefault}`,
    opacity: '0.6',
  },
]);
