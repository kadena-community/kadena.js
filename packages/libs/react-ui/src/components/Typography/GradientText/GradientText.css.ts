import { style, token } from '../../../styles/index';

export const gradientTextClass = style({
  fontWeight: token('typography.weight.secondaryFont.bold'),
  backgroundColor: 'inherit',
  backgroundImage: `linear-gradient(50deg, ${token('color.accent.brand.secondary')}, ${token('color.accent.brand.primary')} 90%)`,
  backgroundSize: '100%',
  color: 'white',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});
