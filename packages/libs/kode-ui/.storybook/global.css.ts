import { globalStyle, vars } from '../src/styles';

globalStyle(
  '#storybook-docs pre.prismjs, #storybook-docs pre.prismjs > div, #storybook-docs pre.prismjs > div span, #storybook-docs code',
  {
    overflowWrap: 'break-word',
    fontFamily: `${vars.fonts.$mono} !important`,
    fontWeight: vars.fontWeights.$medium,
  },
);

globalStyle('code', {
  fontWeight: vars.fontWeights.$semiBold,
});
