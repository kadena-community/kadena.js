import { atoms, tokens } from '@kadena/react-ui/styles';
import { style, styleVariants } from '@vanilla-extract/css';

export const avatarClass = style([
  atoms({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'base.default',
    color: 'text.base.default',
    fontWeight: 'secondaryFont.bold',
    fontSize: 'md',
  }),
  {
    borderRadius: '50%',
  },
]);

export const avatarSizeVariant = styleVariants({
  default: {
    width: tokens.kda.foundation.spacing.xxxl,
    height: tokens.kda.foundation.spacing.xxxl,
  },
  large: {
    width: tokens.kda.foundation.size.n15,
    height: tokens.kda.foundation.size.n15,
  },
});
