import { atoms, tokens } from '@kadena/kode-ui/styles';
import { style, styleVariants } from '@vanilla-extract/css';

export const avatarClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'base.default',
    color: 'text.base.default',
    fontWeight: 'secondaryFont.bold',
  }),
  {
    borderRadius: '50%',
  },
]);

export const avatarSizeVariant = styleVariants({
  default: {
    fontSize: tokens.kda.foundation.typography.fontSize.sm,
    width: tokens.kda.foundation.spacing.xl,
    height: tokens.kda.foundation.spacing.xl,
    minWidth: tokens.kda.foundation.spacing.xl,
    minHeight: tokens.kda.foundation.spacing.xl,
  },
  large: {
    fontSize: tokens.kda.foundation.typography.fontSize.xl,
    width: tokens.kda.foundation.size.n15,
    height: tokens.kda.foundation.size.n15,
    minWidth: tokens.kda.foundation.size.n15,
    minHeight: tokens.kda.foundation.size.n15,
  },
});
