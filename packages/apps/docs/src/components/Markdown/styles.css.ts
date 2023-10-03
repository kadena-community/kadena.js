import { sprinkles } from '@kadena/react-ui/theme';

import { paragraphWrapperClass } from './Paragraph/styles.css';

import { getClassName } from '@/utils/getClassName';
import { globalStyle, style } from '@vanilla-extract/css';

export const wrapperClass = style([
  sprinkles({
    marginY: '$5',
    marginX: 0,
  }),
  {},
]);

globalStyle(
  `${getClassName(wrapperClass)} ${getClassName(paragraphWrapperClass)}`,
  {
    marginTop: 0,
    marginBottom: 0,
  },
);

globalStyle(
  `${getClassName(wrapperClass)} ${getClassName(
    paragraphWrapperClass,
  )} p:empty`,
  {
    display: 'none',
  },
);
