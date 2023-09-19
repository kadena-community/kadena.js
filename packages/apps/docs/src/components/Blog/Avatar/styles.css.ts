import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const avatarClass = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '$16',
    height: '$16',
    backgroundColor: '$primaryContrast',
    color: '$primarySurface',
    fontWeight: '$bold',
    fontSize: '$md',
  }),
  {
    borderRadius: '50%',
  },
]);
