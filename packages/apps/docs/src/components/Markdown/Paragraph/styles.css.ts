import { getClassName } from '@/utils/getClassName';
import { atoms, tokens } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const paragraphWrapperClass = style([
  atoms({
    margin: 'no',
  }),
  {
    wordBreak: 'break-word',
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
    marginBlockStart: tokens.kda.foundation.spacing.md,
  },
);
