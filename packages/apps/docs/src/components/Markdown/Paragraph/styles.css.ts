import { sprinkles } from '@kadena/react-ui/theme';

import { getClassName } from '@/utils/getClassName';
import { globalStyle, style } from '@vanilla-extract/css';

export const paragraphWrapperClass = style([
  sprinkles({
    marginY: 0,
    marginX: 0,
  }),
  {
    wordBreak: 'break-word',
  },
]);

globalStyle(`${getClassName(paragraphWrapperClass)} p:empty`, {
  display: 'none',
});
