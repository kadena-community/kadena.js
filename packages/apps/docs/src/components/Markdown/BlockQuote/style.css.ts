import { atoms, responsiveStyle, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const blockquote = style([
  atoms({
    borderColor: 'base.boldest',
    backgroundColor: 'semantic.info.default',
    fontSize: 'sm',
    marginBlock: 'md',
    paddingBlock: 'sm',
    paddingInlineStart: 'md',
  }),
  {
    borderLeftStyle: 'solid',
    whiteSpace: 'pre-wrap',
    borderLeftWidth: '2px',
    ...responsiveStyle({
      md: {
        paddingInlineEnd: tokens.kda.foundation.spacing.xl,
      },
    }),
  },
]);
