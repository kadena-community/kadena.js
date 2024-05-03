import { getClassName } from '@/utils/getClassName';
import { atoms, tokens } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';
import { paragraphWrapperClass } from '../Paragraph/styles.css';

export const ulListClass = style([
  atoms({
    position: 'relative',
    marginBlock: 'no',
    marginInline: 'no',
    paddingBlock: 'sm',
  }),
  {
    color: tokens.kda.foundation.color.text.subtlest.default,
  },
]);

globalStyle(`article ul > li`, {
  paddingBlockStart: tokens.kda.foundation.spacing.xxs,
  paddingBlockEnd: tokens.kda.foundation.spacing.xxs,
  lineHeight: tokens.kda.foundation.typography.lineHeight.base,
});

globalStyle(
  `article ul +
  ${getClassName(paragraphWrapperClass)},

  `,
  {
    marginBlockStart: tokens.kda.foundation.spacing.md,
  },
);
