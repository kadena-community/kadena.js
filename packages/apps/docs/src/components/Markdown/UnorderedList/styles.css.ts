import { getClassName } from '@/utils/getClassName';
import { atoms, tokens } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';
import { paragraphWrapperClass } from '../Paragraph/styles.css';

export const ulListClass = style([
  atoms({
    position: 'relative',
    color: 'text.base.default',
    marginBlock: 'no',
    marginInline: 'no',
    paddingBlock: 'sm',
  }),
  {},
]);

globalStyle(`article ul > li`, {
  paddingBlockStart: tokens.kda.foundation.spacing.xxs,
  paddingBlockEnd: tokens.kda.foundation.spacing.xxs,
});

globalStyle(
  `article ul +
  ${getClassName(paragraphWrapperClass)},
  
  `,
  {
    marginBlockStart: tokens.kda.foundation.spacing.md,
  },
);
