import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const textAreaClass = style([
  atoms({
    alignItems: 'center',
    background: 'none',
    border: 'none',
    outline: 'none',
    flexGrow: 1,
    color: 'text.base.default',
    borderRadius: 'sm',
    paddingBlock: 'sm',
    paddingInline: 'sm',
    width: '100%',
  }),
  {
    border: `1px solid ${tokens.kda.foundation.color.border.base.boldest}`,
    resize: 'none',
    height: '100px',
  },
]);

export const modalWrapperClass = style([
  atoms({
    paddingInlineEnd: 'xxxl',
  }),
  {
    marginBlockStart: `calc(${tokens.kda.foundation.size.n16} * -1)`,
  },
]);
