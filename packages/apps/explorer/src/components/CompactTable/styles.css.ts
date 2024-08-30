import { atoms, recipe, tokens } from '@kadena/kode-ui/styles';
import { style } from '@vanilla-extract/css';

export const sectionClass = style([
  atoms({
    padding: 'n6',
    backgroundColor: 'base.default',
    marginBlockEnd: 'md',
    display: 'grid',
  }),
  {
    justifyContent: 'start',
    gridTemplateColumns: `auto repeat(3, minmax(${tokens.kda.foundation.size.n32}, 1fr))`,
    gap: `${tokens.kda.foundation.spacing.sm} ${tokens.kda.foundation.spacing.xl}`,
  },
]);

export const headerClass = style([
  atoms({
    fontWeight: 'primaryFont.bold',
  }),
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

export const linkWrapperClass = style({
  width: `calc(100% - 15px)`,
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

export const dataFieldClass = style({
  display: 'flex!important',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',

  fontWeight: tokens.kda.foundation.typography.weight.primaryFont.medium,
  // If we use atoms it will be overridden by the Text component.
  color: tokens.kda.foundation.color.text.base.default,
});

export const dataFieldMultipleIconsClass = style([
  atoms({
    gap: 'xs',
  }),
]);

export const alignVariants = recipe({
  variants: {
    align: {
      start: style({
        justifyContent: 'flex-start',
      }),
      end: style({
        justifyContent: 'flex-end',
      }),
      center: style({
        justifyContent: 'center',
      }),
    },
  },
});
