import { vars } from '@kadena/react-ui/theme';
import { globalStyle, style } from '@vanilla-extract/css';

export const specsWrapper = style({});

globalStyle(`${specsWrapper} .menu-content li span`, {
  color: vars.colors.$foreground,
});

globalStyle(`${specsWrapper} .menu-content li polygon`, {
  fill: vars.colors.$foreground,
});

globalStyle(`${specsWrapper} .api-content`, {
  width: '100%',
  color: vars.colors.$foreground,
});

globalStyle(`${specsWrapper} .api-content polygon`, {
  fill: vars.colors.$foreground,
});

globalStyle(`${specsWrapper} .api-content h1`, {
  lineHeight: '100%',
  color: vars.colors.$foreground,
});

globalStyle(`${specsWrapper} .api-content h2`, {
  lineHeight: '100%',
  color: vars.colors.$foreground,
});

globalStyle(`${specsWrapper} .api-content h3`, {
  lineHeight: '100%',
  color: vars.colors.$foreground,
});

globalStyle(`${specsWrapper} .api-content h4`, {
  lineHeight: '100%',
  color: vars.colors.$foreground,
});

globalStyle(`${specsWrapper} .api-content h5`, {
  lineHeight: '100%',
  color: vars.colors.$foreground,
});

globalStyle(`${specsWrapper} .api-content h6`, {
  lineHeight: '100%',
  color: vars.colors.$foreground,
});

globalStyle(`${specsWrapper} img[alt="logo"]`, {
  display: 'none',
});

globalStyle(`${specsWrapper} .api-content ul[role="tablist"]`, {
  padding: `${vars.sizes.$sm} 0`,
});

globalStyle(`${specsWrapper} .api-content select + label`, {
  width: '100%',
});

globalStyle(`${specsWrapper} .api-content div[role="tabpanel"]`, {
  marginBottom: vars.sizes.$md,
});
