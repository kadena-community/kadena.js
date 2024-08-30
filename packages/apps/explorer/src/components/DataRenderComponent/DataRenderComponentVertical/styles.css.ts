import { atoms, responsiveStyle, tokens } from '@kadena/kode-ui/styles';
import { globalStyle, style } from '@vanilla-extract/css';

export const descriptionListClass = style([
  atoms({
    display: 'grid',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }),
  {
    gap: `${tokens.kda.foundation.spacing.sm} ${tokens.kda.foundation.spacing.lg}`,
  },
]);

export const descriptionListIndentClass = style([
  atoms({
    marginInlineStart: 'md',
  }),
]);

export const descriptionTermClass = style([
  atoms({
    fontFamily: 'primaryFont',
    fontWeight: 'primaryFont.bold',
  }),
  {
    gridColumnStart: 1,
  },
]);

export const descriptionDetailsClass = style({
  display: 'inline',
  position: 'relative',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  ...responsiveStyle({
    xs: {
      gridColumnStart: 1,
    },
    sm: {
      gridColumnStart: 2,
    },
  }),
});

export const descriptionDetailsExpandedClass = style({
  overflow: 'unset',
  textOverflow: 'unset',
  whiteSpace: 'break-spaces',
  wordBreak: 'break-all',
});

export const descriptionDetailsLinkClass = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.kda.foundation.spacing.sm,
  minWidth: 0,
  ...responsiveStyle({
    xs: {
      gridColumnStart: 1,
    },
    sm: {
      gridColumnStart: 2,
    },
  }),
});

export const linkClass = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
});

export const iconLinkClass = style([
  atoms({
    color: 'text.base.default',
  }),
]);

export const linkIconClass = style([
  atoms({
    fontSize: 'xs',
  }),
  {
    minWidth: 'fit-content',
  },
]);

export const textClass = style({
  // If we use atoms it will be overridden by the Text component.
  color: tokens.kda.foundation.color.text.base.default,
});

export const textCopyClass = style([]);

globalStyle(`${textCopyClass} + svg`, {
  position: 'absolute',
  marginInlineStart: '5px',
  width: '18px',
  aspectRatio: '1/1',
  display: 'inline',
});
