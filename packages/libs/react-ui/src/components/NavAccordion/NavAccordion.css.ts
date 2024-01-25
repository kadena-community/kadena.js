import { style } from '@vanilla-extract/css';
import { sprinkles } from '../../styles/sprinkles.css';
import { vars } from '../../styles/vars.css';

export const navAccordionWrapperClass = style({});

export const navAccordionListClass = style([
  sprinkles({
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  }),
  {
    selectors: {
      '&:last-child': {
        marginBottom: vars.sizes.$2,
      },
    },
  },
]);

export const navAccordionListItemClass = style([
  sprinkles({
    alignItems: 'center',
    display: 'flex',
    lineHeight: '$normal',
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    paddingLeft: '$5',
    position: 'relative',
  }),
  {
    selectors: {
      '&:before': {
        content: '·',
        fontSize: vars.fontSizes.$xl,
        lineHeight: vars.lineHeights.$normal,
        paddingRight: vars.sizes.$2,
        verticalAlign: 'middle',
        position: 'absolute',
        left: vars.sizes.$1,
      },
    },
  },
]);

export const navAccordionGroupButtonClass = style([
  sprinkles({
    alignItems: 'center',
    marginBottom: 0,
    textAlign: 'left',
  }),
  {
    justifyContent: 'flex-start',
    paddingBottom: '0 !important',
  },
]);

export const navAccordionGroupTitleClass = style([
  sprinkles({
    fontWeight: '$normal',
    paddingLeft: '$1',
  }),
]);

export const navAccordionGroupIconClass = style([
  sprinkles({
    color: '$layoutSurfaceOverlay',
  }),
  {
    transform: 'rotate(-90deg)',
    transition: 'transform 0.2s ease',
    selectors: {
      '&.isOpen': {
        transform: 'rotate(0deg)',
      },
    },
  },
]);

export const navAccordionGroupListClass = style([
  sprinkles({
    margin: 0,
    marginTop: '$2',
    marginBottom: '$2',
    marginLeft: '$2',
    overflow: 'hidden',
    padding: 0,
  }),
  {
    borderLeft: `1px solid ${vars.colors.$layoutSurfaceSubtle}`,
  },
]);

export const navAccordionGroupListItemClass = style([
  {
    paddingLeft: '0',
  },
]);
export const navAccordionLinkClass = style([
  sprinkles({
    color: '$layoutSurfaceOverlay',
    paddingY: '$1',
    textDecoration: 'none',
  }),
  {
    selectors: {
      '&:active, &:hover': {
        color: `${vars.colors.$negativeSurface} !important`,
      },
      '&:hover': {
        textDecoration: 'underline',
      },
      '&:visited': {
        color: `${vars.colors.$layoutSurfaceOverlay} !important`,
        textDecoration: 'none !important',
      },
      // Top level links
      'nav > &': {
        alignItems: 'center',
        borderBottom: `1px solid ${vars.colors.$borderDefault}`,
        color: vars.colors.$neutral5,
        display: 'flex',
        fontSize: vars.fontSizes.$base,
        fontWeight: vars.fontWeights.$semiBold,
        paddingBottom: vars.sizes.$2,
        paddingTop: 0,
        textDecoration: 'none',
      },
      'nav > &:hover': {
        color: `${vars.colors.$neutral5} !important`,
      },
      // Sub level links
      [`${navAccordionGroupListItemClass} &`]: {
        alignItems: 'center',
        color: vars.colors.$neutral4,
        display: 'flex',
        fontSize: vars.fontSizes.$sm,
        marginLeft: vars.sizes.$2,
        paddingLeft: vars.sizes.$5,
        position: 'relative',
      },
      [`${navAccordionGroupListItemClass} &:before`]: {
        content: '·',
        fontSize: vars.fontSizes.$xl,
        left: vars.sizes.$1,
        lineHeight: vars.lineHeights.$base,
        paddingRight: vars.sizes.$2,
        position: 'absolute',
        verticalAlign: 'middle',
      },
    },
  },
]);
