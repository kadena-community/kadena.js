import { getClassName } from '@/utils/getClassName';
import { sprinkles, vars } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';
import { paragraphWrapperClass } from '../Paragraph/styles.css';

export const ulListClass = style([
  sprinkles({
    marginY: 0,
    marginX: 0,
    paddingY: '$2',
    position: 'relative',
    color: '$neutral4',
  }),
]);

globalStyle(`article ul > li`, {
  paddingTop: vars.sizes.$2xs,
  paddingBottom: vars.sizes.$2xs,
});

globalStyle(
  `article ul +
  ${getClassName(paragraphWrapperClass)},
  
  `,
  {
    marginTop: vars.sizes.$md,
  },
);
