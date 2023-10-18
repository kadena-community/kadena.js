import { getClassName } from '@/utils/getClassName';
import { sprinkles, vars } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';

export const paragraphWrapperClass = style([
  sprinkles({
    margin: 0,
  }),
  {
    wordBreak: 'break-word',
    selectors: {},
  },
]);

globalStyle(`article ${getClassName(paragraphWrapperClass)} p:empty`, {
  display: 'none',
});

globalStyle(
  `article
  ${getClassName(paragraphWrapperClass)} +
  ${getClassName(paragraphWrapperClass)}
  `,
  {
    marginTop: vars.sizes.$md,
  },
);
