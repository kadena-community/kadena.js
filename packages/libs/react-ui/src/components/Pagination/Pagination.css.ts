import { sprinkles, vars } from '../../styles';

import { style } from '@vanilla-extract/css';

export const listClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '$2',
    padding: 0,
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
    color: '$primaryContrastInverted',
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
    color: '$primaryContrastInverted',
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
