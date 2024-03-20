import { atoms, tokens } from '@kadena/react-ui/styles';
import { style } from '@vanilla-extract/css';

export const showOnMobileClass = style([
  atoms({
    display: {
      sm: 'block',
      md: 'none',
    },
  }),
]);

export const linkClass = style([
  atoms({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    color: 'text.subtle.default',
    fontWeight: 'secondaryFont.bold',
    textDecoration: 'none',
  }),
  {
    selectors: {
      '&::after': {
        position: 'absolute',
        right: tokens.kda.foundation.spacing.sm,
        content: '',
        width: tokens.kda.foundation.spacing.sm,
        height: tokens.kda.foundation.spacing.sm,
        borderRight: `2px solid ${tokens.kda.foundation.color.border.base.inverse.default}`,
        borderTop: `2px solid ${tokens.kda.foundation.color.border.base.inverse.default}`,
        opacity: 0,

        transform: `rotate(45deg) translate(-${tokens.kda.foundation.spacing.xs}, ${tokens.kda.foundation.spacing.xs})`,
        transition: 'transform .2s ease ',
      },
      '&:hover': {
        color: tokens.kda.foundation.color.text.brand.primary.default,
      },
      '&:hover::after': {
        opacity: 1,
        transform: 'rotate(45deg) translate(0, 0)',
      },
    },
  },
]);
