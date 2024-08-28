import { style, token } from '../../styles';

export const containerClass = style({
  backgroundColor: token('color.background.layer.default'),
  color: token('color.text.base.default'),
  paddingInline: token('spacing.xxl'),
  paddingBlock: token('spacing.lg'),
  borderRadius: token('spacing.sm'),
  border: token('border.hairline'),
  position: 'relative',
  maxWidth: '100%',
  width: 'max-content',
});

export const fullWidthClass = style({ width: '100%' });

export const disabledClass = style({
  pointerEvents: 'none',
  opacity: 0.5,
});
