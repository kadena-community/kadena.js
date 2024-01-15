import { atoms, tokens } from '@kadena/react-ui/theme';
import { style, styleVariants } from '@vanilla-extract/css';
import { $$borderColor } from '../../global.css';

export const treeListClass = style([
  atoms({
    padding: 'no',
    fontSize: 'sm',
  }),
  {
    overflowX: 'hidden',
    listStyle: 'none',
    overflowY: 'hidden',
    transition: 'all .5s ease',
  },
]);

export const treeListLevelVariantClass = styleVariants({
  l1: {},
  l2: {},
  l3: {
    marginInlineStart: tokens.kda.foundation.spacing.xs,
    borderLeft: `1px solid ${$$borderColor}`,
  },
});

export const treeListRootVariantClass = styleVariants({
  isRoot: {
    height: 'auto!important',
  },
  isNotRoot: {},
});

export const linkClass = style([
  atoms({
    textDecoration: 'none',
    color: 'text.base.default',
    textTransform: 'capitalize',
  }),
  {
    selectors: {
      '&:hover': {
        color: tokens.kda.foundation.color.brand.primary.default,
        textDecoration: 'none',
      },
    },
  },
]);

export const listItemClass = style({
  selectors: {
    '&:first-of-type': {
      marginBlockStart: tokens.kda.foundation.spacing.sm,
    },
  },
});

export const listItemVariants = styleVariants({
  l1: {},
  l2: {},
  l3: {
    marginBlockStart: tokens.kda.foundation.spacing.sm,
    selectors: {
      '&:last-of-type': {
        marginBlockEnd: tokens.kda.foundation.spacing.lg,
      },
    },
  },
});

export const linkActiveClass = styleVariants({
  false: {},
  true: { color: tokens.kda.foundation.color.text.brand.primary.default },
});

export const levelItemVariantClass = styleVariants({
  l1: {
    display: 'block',
    cursor: 'pointer',
    fontWeight: tokens.kda.foundation.typography.weight.bodyFont.bold,
    padding: `${tokens.kda.foundation.spacing.md} 0 ${tokens.kda.foundation.spacing.sm}`,
    borderBottom: `1px solid ${$$borderColor}`,
  },
  l2: {
    display: 'block',
    cursor: 'pointer',
    padding: `${tokens.kda.foundation.spacing.xs} 0`,
    border: 0,
  },
  l3: {
    display: 'block',
    cursor: 'pointer',
    padding: `0 ${tokens.kda.foundation.size.n3}`,
    border: 0,
    fontSize: tokens.kda.foundation.typography.fontSize.sm,
  },
});

const markerStyle: Record<string, string> = {
  content: '∙',
  fontWeight: '$bold',
  display: 'inline-block',
  width: tokens.kda.foundation.spacing.md,
};

export const levelItemLinkPseudoVariantClass = styleVariants({
  l1: {},
  l2: {
    selectors: {
      '&::before': markerStyle,
    },
  },
  l3: {
    selectors: {
      '&::before': markerStyle,
    },
  },
});

export const treeItemPseudoMenuVariantClass = styleVariants({
  'l1-true': {
    selectors: {
      '&::after': {
        transform: 'translate(1px, 1px)  rotate(45deg)!important',
      },
    },
  },
  'l1-false': {},
  'l2-true': {
    padding: `${tokens.kda.foundation.spacing.sm} ${tokens.kda.foundation.spacing.md}`,
    selectors: {
      '&::before': {
        transform: `translate(${tokens.kda.foundation.spacing.sm}, ${tokens.kda.foundation.spacing.xs}) rotate(135deg)!important`,
      },
    },
  },
  'l2-false': {
    padding: `${tokens.kda.foundation.spacing.sm} ${tokens.kda.foundation.spacing.md}`,
  },
  'l3-true': {},
  'l3-false': {},
});

export const treeItemButtonClass = style([
  atoms({
    position: 'relative',
    width: '100%',
    textAlign: 'left',
    backgroundColor: 'transparent',
    textTransform: 'capitalize',
    fontSize: 'sm',
    color: 'text.base.default',
  }),
  {
    borderTop: 0,
    borderRight: 0,
    borderLeft: 0,
    selectors: {
      '&:hover': {
        color: tokens.kda.foundation.color.brand.primary.default,
      },
    },
  },
]);

export const treeItemPseudoVariantClass = styleVariants({
  l1: {
    selectors: {
      '&::after': {
        position: 'absolute',
        right: tokens.kda.foundation.spacing.xs,
        content: '+',
        fontWeight: tokens.kda.foundation.typography.weight.bodyFont.regular,
        transform: 'translate(0, 0) rotate(0)',
        transition: 'transform .2s ease',
      },
    },
  },
  l2: {
    selectors: {
      '&::before': {
        position: 'absolute',
        left: `calc(0px - ${tokens.kda.foundation.spacing.sm})`,
        content: '',
        width: tokens.kda.foundation.spacing.sm,
        height: tokens.kda.foundation.spacing.sm,
        borderRight: `2px solid ${$$borderColor}`,
        borderTop: `2px solid ${$$borderColor}`,
        transform: `translate(${tokens.kda.foundation.spacing.sm}, ${tokens.kda.foundation.spacing.xs}) rotate(45deg)`,
        transition: 'transform .2s ease',
      },
    },
  },
  l3: {},
});
