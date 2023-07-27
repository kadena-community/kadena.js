import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const avatar = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '$10',
    height: '$10',
    backgroundColor: '$primaryContrast',
    color: '$primarySurface',
    fontWeight: '$bold',
    fontSize: '$md',
  }),
  {
    borderRadius: '100%',
  },
]);
