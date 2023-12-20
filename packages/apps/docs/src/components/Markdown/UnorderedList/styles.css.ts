import { getClassName } from '@/utils/getClassName';
import { sprinkles, vars } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';
import { paragraphWrapperClass } from '../Paragraph/styles.css';

export const ulListClass = style([
  sprinkles({
    marginBlock: 0,
    marginInline: 0,
    paddingBlock: '$2',
    position: 'relative',
    color: '$neutral4',
  }),
]);

globalStyle(`article ul > li`, {
  paddingBlockStart: vars.sizes.$2xs,
  paddingBlockEnd: vars.sizes.$2xs,
});

globalStyle(
  `article ul +
  ${getClassName(paragraphWrapperClass)},
  
  `,
  {
    marginBlockStart: vars.sizes.$md,
  },
);
