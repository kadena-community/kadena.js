import { style } from '@kadena/kode-ui';
import { atoms, token, tokens } from '@kadena/kode-ui/styles';
import { globalStyle } from '@vanilla-extract/css';

export const profileItemClass = style([
  atoms({
    cursor: 'pointer',
    borderColor: 'base.subtle',
    borderWidth: 'hairline',
    borderStyle: 'solid',
    borderRadius: 'sm',
    paddingInline: 'n4',
    paddingBlock: 'n3',
  }),
  {
    backdropFilter: 'blur(12px)',
    backgroundColor: token('color.background.layer.default'),
    selectors: {
      '&:hover': {
        backgroundColor: tokens.kda.foundation.color.background.base.default,
      },
    },
  },
]);

export const iconWrapperClass = style([
  atoms({
    color: 'icon.base.default',
  }),
]);

globalStyle(`${iconWrapperClass} > svg`, {
  width: '20px',
  height: '20px',
});
