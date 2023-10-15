import { sprinkles, vars } from '@kadena/react-ui/theme';

import { paragraphWrapperClass } from '../Paragraph/styles.css';

import { getClassName } from '@/utils/getClassName';
import { globalStyle, style } from '@vanilla-extract/css';

export const olListClass = style([
  sprinkles({
    paddingY: '$2',
    marginX: 0,
    position: 'relative',
    color: '$neutral4',
  }),
]);

globalStyle(`article ol > li`, {
  paddingTop: vars.sizes.$2xs,
  paddingBottom: vars.sizes.$2xs,
});

globalStyle(
  `article
  ol +
  ${getClassName(paragraphWrapperClass)}
  `,
  {
    marginTop: vars.sizes.$md,
  },
);
