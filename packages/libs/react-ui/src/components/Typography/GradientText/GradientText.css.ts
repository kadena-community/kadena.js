import { style } from '@vanilla-extract/css';
import { atoms } from '../../../styles/atoms.css';
import { tokens } from '../../../styles/index';

export const gradientTextClass = style([
  atoms({
    fontWeight: 'secondaryFont.bold',
  }),
  {
    backgroundColor: 'inherit',
    backgroundImage: `linear-gradient(50deg, ${tokens.kda.foundation.color.accent.brand.secondary}, ${tokens.kda.foundation.color.accent.brand.primary} 90%)`,
    backgroundSize: '100%',
    color: 'white',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
]);
