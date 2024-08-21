import { token, tokens } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

globalStyle('body,html', {
  backgroundColor: tokens.kda.foundation.color.background.base.default,
});

globalStyle('a:not([data-variant])', {
  color: token('color.link.base.default'),
});

globalStyle('a:hover:not([data-variant])', {
  color: token('color.link.base.@focus'),
});

export const fullWidthClass = style({
  width: '100%',
});
