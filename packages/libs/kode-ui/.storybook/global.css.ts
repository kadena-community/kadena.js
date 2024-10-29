import { globalStyle, vars } from '../src/styles';

globalStyle('pre.prismjs > div, pre.prismjs > div span, code', {
  overflowWrap: 'break-word',
  fontFamily: `${vars.fonts.$mono} !important`,
  fontWeight: vars.fontWeights.$medium,
});

globalStyle('code', {
  fontWeight: vars.fontWeights.$semiBold,
});
