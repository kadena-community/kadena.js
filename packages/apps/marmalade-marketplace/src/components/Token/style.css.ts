import { tokens } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const mainContainer = style({
  width: '100%',
  padding: tokens.kda.foundation.spacing.n2,
  border: `1px solid ${tokens.kda.foundation.color.border.base.subtle}`,
  borderRadius: tokens.kda.foundation.radius.sm,
  backgroundColor: tokens.kda.foundation.color.background.layer.default,
  cursor: 'pointer',
  opacity: 1,
  transition: 'opacity .4s ease',
  selectors: {
    '&:hover': {
      opacity: '.8',
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
  borderRadius: '16px',
  transform: 'scale(100%)',
  transition: 'transform .4s ease',
  selectors: {
    '&:hover': {
      transform: 'scale(105%)',
    },
  },
});

export const titleContainer = style({
  marginTop: tokens.kda.foundation.spacing.n4,
  marginLeft: tokens.kda.foundation.spacing.n2,
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
