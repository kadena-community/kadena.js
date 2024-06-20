import { style } from '../../styles';
import { token } from '../../styles/themeUtils';

export const containerClass = style({
  width: '100%',
  height: token('size.n16'),
  backgroundColor: token('color.neutral.n1'),
});

export const contentClass = style({
  position: 'relative',
  paddingInline: token('spacing.sm'),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginInline: 'auto',
  height: '100%',
});

export const itemsContainerClass = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  flex: 1,
  alignItems: 'center',
  height: '100%',
  gap: token('spacing.md'),
  overflowX: 'auto',
  paddingInline: token('spacing.md'),
  marginInlineStart: 'auto',
});

export const logoClass = style({
  marginInlineEnd: token('spacing.md'),
  marginBlock: token('spacing.sm'),
  padding: token('spacing.xs'),
  borderRadius: token('spacing.sm'),
  flexShrink: 0,
  selectors: {
    '&:focus-visible': {
      outline: `${token('border.width.normal')} solid ${token(
        'color.border.brand.primary.@focus',
      )}`,
    },
  },
});

export const navListClass = style({
  alignItems: 'stretch',
  display: 'flex',
  gap: token('spacing.sm'),
  flex: 1,
  paddingInline: 0,
  listStyle: 'none',
  zIndex: 1,
});

export const linkClass = style({
  alignItems: 'center',
  display: 'flex',
  fontSize: token('spacing.sm'),
  fontWeight: token('typography.weight.primaryFont.medium'),
  textDecoration: 'none',
  borderRadius: token('radius.sm'),
  paddingInline: token('spacing.sm'),
  paddingBlock: token('spacing.xs'),
  whiteSpace: 'nowrap',
  color: token('color.neutral.n70'),
  transition: 'background 0.1s ease, color 0.1s ease',
  selectors: {
    '&:hover': {
      color: token('color.neutral.n100'),
      textDecoration: 'none',
    },
    '&:focus-visible': {
      color: token('color.neutral.n100'),
      outline: `${token('border.width.normal')} solid ${token(
        'color.border.brand.primary.@focus',
      )}`,
      textDecoration: 'none',
    },
    "&[data-state='active']": {
      backgroundColor: token('color.neutral.n100'),
      color: token('color.neutral.n1'),
    },
  },
});

export const iconButtonClass = style([
  {
    background: 'none !important',
    fill: `${token('color.neutral.n70')} !important`,
    selectors: {
      '&:hover, &:focus-visible': {
        background: 'none',
        fill: `${token('color.neutral.n100')} !important`,
      },
    },
  },
]);

export const selectContainerClass = style([
  {
    border: `1px solid ${token('color.neutral.n60')}`,
  },
]);
