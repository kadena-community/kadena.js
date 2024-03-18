import { tokens } from '@kadena/react-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const specsWrapper = style({});

globalStyle(`.${specsWrapper} .menu-content li span`, {
  color: tokens.kda.foundation.color.text.base.default,
});

globalStyle(`.${specsWrapper} .menu-content li polygon`, {
  fill: tokens.kda.foundation.color.text.base.default,
});

globalStyle(`.${specsWrapper} .api-content`, {
  width: '100%',
  color: tokens.kda.foundation.color.text.base.default,
});

globalStyle(`.${specsWrapper} .api-content polygon`, {
  fill: tokens.kda.foundation.color.text.base.default,
});

globalStyle(`.${specsWrapper} .api-content h1`, {
  lineHeight: '100%',
  color: tokens.kda.foundation.color.text.base.default,
});

globalStyle(`.${specsWrapper} .api-content h2`, {
  lineHeight: '100%',
  color: tokens.kda.foundation.color.text.base.default,
});

globalStyle(`.${specsWrapper} .api-content h3`, {
  lineHeight: '100%',
  color: tokens.kda.foundation.color.text.base.default,
});

globalStyle(`.${specsWrapper} .api-content h4`, {
  lineHeight: '100%',
  color: tokens.kda.foundation.color.text.base.default,
});

globalStyle(`.${specsWrapper} .api-content h5`, {
  lineHeight: '100%',
  color: tokens.kda.foundation.color.text.base.default,
});

globalStyle(`.${specsWrapper} .api-content h6`, {
  lineHeight: '100%',
  color: tokens.kda.foundation.color.text.base.default,
});

globalStyle(`.${specsWrapper} img[alt="logo"]`, {
  display: 'none',
});

globalStyle(`.${specsWrapper} .api-content ul[role="tablist"]`, {
  padding: `${tokens.kda.foundation.spacing.sm} 0`,
});

globalStyle(`.${specsWrapper} .api-content select + label`, {
  width: '100%',
});

globalStyle(`.${specsWrapper} .api-content div[role="tabpanel"]`, {
  marginBlockEnd: tokens.kda.foundation.spacing.md,
});
