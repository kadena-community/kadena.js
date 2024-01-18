import { getClassName } from '@/utils/getClassName';
import { atoms, tokens } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';
import { paragraphWrapperClass } from '../Paragraph/styles.css';

export const olListClass = style([
  atoms({
    position: 'relative',
    color: 'text.base.default',
    paddingBlock: 'sm',
    marginInline: 'no',
  }),
]);

globalStyle(`article ol > li`, {
  paddingBlockStart: tokens.kda.foundation.spacing.xxs,
  paddingBlockEnd: tokens.kda.foundation.spacing.xxs,
});

globalStyle(
  `article
  ol +
  ${getClassName(paragraphWrapperClass)}
  `,
  {
    marginBlockStart: tokens.kda.foundation.spacing.md,
  },
);
