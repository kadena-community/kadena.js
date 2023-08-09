import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export const listClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
  }),
  { listStyleType: 'none' },
]);

export const pageNavButtonClass = style([
  sprinkles({
    display: 'flex',
    gap: '$3',
    alignItems: 'center',
    paddingX: '$3',
    paddingY: '$2',
    color: '$primaryContrast',
    border: 'none',
    background: 'none',
    fontWeight: '$semiBold',
  }),
  {
    ':disabled': {
      pointerEvents: 'none',
      color: vars.colors.$disabledContrast,
    },
  },
]);

export const pageNavLabelClass = style([
  sprinkles({
    display: { xs: 'none', sm: 'block' },
  }),
]);

export const pageNumButtonClass = style([
  sprinkles({
    color: '$primaryContrast',
    width: '$8',
    paddingY: '$2',
    border: 'none',
    background: 'none',
    fontWeight: '$semiBold',
  }),
  {
    selectors: {
      '&.current': {
        borderRadius: vars.radii.$sm,
        outline: `2px auto ${vars.colors.$primaryAccent}`,
      },
    },
  },
]);
