import { style, styleVariants, token } from '../../../styles';

export const headerClass = style({
  display: 'flex',
  alignItems: 'center',
  gap: token('spacing.sm'),
});

export const infoClass = style({
  display: 'flex',
  alignItems: 'center',
  gap: token('spacing.xxs'),
  fontSize: token('typography.fontSize.xs'),
  marginInlineStart: 'auto',
  color: token('color.text.base.default'),
});

export const tagClass = style({
  backgroundColor: token('color.background.base.inverse.default'),
  color: token('color.text.base.inverse.default'),
  borderRadius: token('radius.sm'),
  paddingInline: token('spacing.sm'),
  fontSize: token('typography.fontSize.xs'),
  fontWeight: token('typography.weight.secondaryFont.bold'),
  display: 'inline-block',
  paddingTop: '0.05rem',
  paddingBottom: '0.05rem',
});

export const labelClass = style({
  fontSize: token('typography.fontSize.sm'),
  color: token('color.text.base.default'),
  fontWeight: token('typography.weight.secondaryFont.bold'),
});

export const disabledLabelClass = style({
  fontSize: token('typography.fontSize.sm'),
  pointerEvents: 'none',
  fontWeight: token('typography.weight.secondaryFont.bold'),
  color: token('color.text.base.@disabled'),
});

export const directionClass = styleVariants({
  'column': {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  'row': {
    flexDirection: 'row',
    alignItems: 'center',
  }
})

export const directionInfoClass = styleVariants({
  'column': {
    marginInlineStart: 'unset',
  },
  'row': {
    marginInlineStart: 'auto',
  }
})
