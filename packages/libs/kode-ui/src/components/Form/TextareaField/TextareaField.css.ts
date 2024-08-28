import { style, styleVariants, token } from '../../../styles';

export const addon = style({
  position: 'absolute',
  insetBlockStart: token('spacing.sm'),
  insetInlineEnd: token('spacing.sm'),
});

const textareaBase = style({
  resize: 'none',
  scrollbarWidth: 'none',
});

export const textarea = styleVariants({
  sm: [
    textareaBase,
    {
      minHeight: token('size.n24'),
    },
  ],
  md: [
    textareaBase,
    {
      minHeight: token('size.n30'),
    },
  ],
  lg: [
    textareaBase,
    {
      minHeight: '140px',
    },
  ],
});
