import { style, token } from '../../styles';

export const containerClass = style({
  display: 'grid',
  gap: token('spacing.md'),
  alignItems: 'center',
  color: token('color.neutral.n60'),
  gridRowGap: token('size.n1'),
  gridTemplateColumns: 'auto 1fr',
});

export const descriptionClass = style({
  gridColumnStart: 2,
});
