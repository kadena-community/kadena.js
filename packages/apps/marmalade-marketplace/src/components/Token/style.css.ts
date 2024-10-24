import { atoms, token, tokens } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const mainContainer = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: tokens.kda.foundation.spacing.n2,
  border: `1px solid ${tokens.kda.foundation.color.border.base.subtle}`,
  borderRadius: tokens.kda.foundation.radius.sm,
  backgroundColor: tokens.kda.foundation.color.background.layer.default,
  cursor: 'pointer',
  gap: tokens.kda.foundation.spacing.n4,
  transition: 'background-color .3s linear',
  willChange: 'background-color',
  selectors: {
    '&:hover': {
      backgroundColor: token('color.background.brand.primary.subtle'),
    },
  },
});

export const tokenLink = style({
  textDecoration: 'none',
});

export const tokenImageContainer = style({
  width: '100%',
  height: '210px',
});

export const tokenImageClass = style({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '2px',
});

export const titleContainer = style([
  atoms({
    gap: 'sm',
    paddingInline: 'xs',
  }),
]);
export const subTitle = style({
  color: token('color.text.gray.default'),
});

export const metaContainer = style({
  marginTop: tokens.kda.foundation.spacing.n2,
  padding: `${tokens.kda.foundation.spacing.n2} ${tokens.kda.foundation.spacing.n3}`,
  display: 'flex',
  backgroundColor: tokens.kda.foundation.color.background.base.default,
  borderRadius: tokens.kda.foundation.radius.xs,
});

globalStyle(`${metaContainer} div`, {
  flex: 1,
});
