import { atoms, responsiveStyle, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const flexClass = style([
  atoms({
    display: 'flex',
    gap: 'md',
  }),
  {
    ...responsiveStyle({
      xs: {
        flexDirection: 'column',
      },
      sm: {
        flexDirection: 'row',
      },
    }),
  },
]);

export const headerClass = style({
  fontWeight: 'bold',
});

export const dataFieldClass = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontWeight: tokens.kda.foundation.typography.weight.primaryFont.medium,
  // If we use atoms it will be overridden by the Text component.
  color: tokens.kda.foundation.color.text.base.default,
});

export const dataFieldLinkClass = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.kda.foundation.spacing.sm,
  minWidth: 0,
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
