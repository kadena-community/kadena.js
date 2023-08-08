// TODO: use common wrapper once https://github.com/kadena-community/kadena.js/pull/735/
//       gets merged
import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const wrapperClass = style([
  sprinkles({
    marginY: '$5',
    marginX: 0,
  }),
]);
