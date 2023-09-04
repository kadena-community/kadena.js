import { sprinkles, vars } from '@kadena/react-ui/theme';

import { $$borderColor } from '../../global.css';

import { style, styleVariants } from '@vanilla-extract/css';

export const treeListClass = style([
  sprinkles({
    padding: 0,
  }),
  {
    listStyle: 'none',
    overflowY: 'hidden',
    transition: 'all .5s ease',
  },
]);

export const treeListLevelVariantClass = styleVariants({
  l1: {},
  l2: {},
  l3: {
    marginLeft: vars.sizes.$1,
    borderLeft: `1px solid ${$$borderColor}`,
  },
});

export const treeListRootVariantClass = styleVariants({
  isRoot: {
    height: 'auto!important',
  },
  isNotRoot: {},
});

export const styledLinkClass = style([
  sprinkles({
    textDecoration: 'none',
    color: '$foreground',
    textTransform: 'capitalize',
  }),
  {
    selectors: {
      '&:hover': {
        color: vars.colors.$primaryHighContrast,
      },
    },
  },
]);

export const styledLinkActiveClass = styleVariants({
  false: {},
  true: { color: vars.colors.$primaryContrast },
});

export const levelItemVariantClass = styleVariants({
  l1: {
    display: 'block',
    cursor: 'pointer',
    fontWeight: vars.fontWeights.$bold,
    padding: `${vars.sizes.$4} 0 ${vars.sizes.$2}`,
    borderBottom: `1px solid ${$$borderColor}`,
  },
  l2: {
    display: 'block',
    cursor: 'pointer',
    padding: `${vars.sizes.$2} 0`,
    border: 0,
  },
  l3: {
    display: 'block',
    cursor: 'pointer',
    padding: `0 ${vars.sizes.$3}`,
    border: 0,
  },
});

const markerStyle: Record<string, string> = {
  content: '∙',
  fontWeight: '$bold',
  display: 'inline-block',
  width: vars.sizes.$4,
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
    selectors: {
      '&::before': {
        transform: `translate(${vars.sizes.$2}, ${vars.sizes.$1}) rotate(135deg)!important`,
      },
    },
  },
  'l2-false': {},
  'l3-true': {},
  'l3-false': {},
});

export const treeItemButtonClass = style([
  sprinkles({
    position: 'relative',
    width: '100%',
    textAlign: 'left',
    backgroundColor: 'transparent',
    textTransform: 'capitalize',
    fontSize: '$base',
    color: '$foreground',
  }),
  {
    borderTop: 0,
    borderRight: 0,
    borderLeft: 0,
    selectors: {
      '&:hover': {
        color: vars.colors.$primaryHighContrast,
      },
    },
  },
]);

export const treeItemPseudoVariantClass = styleVariants({
  l1: {
    selectors: {
      '&::after': {
        position: 'absolute',
        right: vars.sizes.$1,
        content: '+',
        fontWeight: vars.fontWeights.$light,
        transform: 'translate(0, 0) rotate(0)',
        transition: 'transform .2s ease ',
      },
    },
  },
  l2: {
    paddingLeft: vars.sizes.$4,
    paddingRight: vars.sizes.$4,

    selectors: {
      '&::before': {
        position: 'absolute',
        left: `calc(0px - ${vars.sizes.$2})`,
        content: '',
        width: vars.sizes.$2,
        height: vars.sizes.$2,
        borderRight: `2px solid ${$$borderColor}`,
        borderTop: `2px solid ${$$borderColor}`,
        transform: `translate(${vars.sizes.$2}, ${vars.sizes.$1}) rotate(45deg)`,
        transition: 'transform .2s ease ',
      },
    },
  },
  l3: {
    fontSize: `${vars.fontSizes.$sm}`,
  },
});
