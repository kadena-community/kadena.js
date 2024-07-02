import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const sectionClass = style([
  atoms({
    padding: 'n6',
    backgroundColor: 'base.default',
    marginBlockEnd: 'md',
  }),
]);

export const headerClass = style([
  atoms({
    fontWeight: 'primaryFont.bold',
  }),
]);

export const dataFieldClass = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontWeight: tokens.kda.foundation.typography.weight.primaryFont.medium,
  // If we use atoms it will be overridden by the Text component.
  color: tokens.kda.foundation.color.text.base.default,
});

export const rowClass = style([
  atoms({ gap: 'md' }),
  {
    display: 'flex',
  },
]);

export const badgeClass = style({
  backgroundColor: tokens.kda.foundation.color.neutral.n100,
  color: tokens.kda.foundation.color.neutral.n0,
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
