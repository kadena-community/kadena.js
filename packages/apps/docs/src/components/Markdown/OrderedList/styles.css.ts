import { getClassName } from '@/utils/getClassName';
import { sprinkles, vars } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';
import { paragraphWrapperClass } from '../Paragraph/styles.css';

export const olListClass = style([
  sprinkles({
    position: 'relative',
    color: '$neutral4',
  }),
  {
    marginInline: 0,
    paddingBlock: vars.sizes.$2,
  },
]);

globalStyle(`article ol > li`, {
  paddingBlockStart: vars.sizes.$2xs,
  paddingBlockEnd: vars.sizes.$2xs,
});

globalStyle(
  `article
  ol +
  ${getClassName(paragraphWrapperClass)}
  `,
  {
    marginBlockStart: vars.sizes.$md,
  },
);
