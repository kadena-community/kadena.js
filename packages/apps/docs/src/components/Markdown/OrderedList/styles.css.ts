import { getClassName } from '@/utils/getClassName';
import { atoms, tokens } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';
import { paragraphWrapperClass } from '../Paragraph/styles.css';

export const olListClass = style([
  atoms({
    position: 'relative',
    paddingBlock: 'sm',
    marginInline: 'no',
  }),
]);

globalStyle(`article ol > li`, {
  paddingBlockStart: tokens.kda.foundation.spacing.xxs,
  paddingBlockEnd: tokens.kda.foundation.spacing.xxs,
  color: tokens.kda.foundation.color.text.subtlest.default,
  lineHeight: tokens.kda.foundation.typography.lineHeight.base,
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
