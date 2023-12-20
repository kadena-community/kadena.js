import { getClassName } from '@/utils/getClassName';
import { sprinkles, vars } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';
import { paragraphWrapperClass } from '../Paragraph/styles.css';

export const olListClass = style([
  sprinkles({
    paddingBlock: '$2',
    marginInline: 0,
    position: 'relative',
    color: '$neutral4',
  }),
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
