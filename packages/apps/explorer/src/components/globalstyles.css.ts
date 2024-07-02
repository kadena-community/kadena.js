import { token, tokens } from '@kadena/kode-ui/styles';
import { globalStyle } from '@vanilla-extract/css';

globalStyle('body,html', {
  backgroundColor: tokens.kda.foundation.color.background.base.default,
});

globalStyle('a', {
  color: token('color.link.base.default'),
});

globalStyle('a:hover', {
  color: token('color.link.base.@focus'),
});
