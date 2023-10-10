import {
  accordionButtonClass as navAccordionButtonClass,
  accordionContentClass as navAccordionContentClass,
  accordionSectionWrapperClass as navAccordionSectionWrapperClass,
  accordionToggleIconClass as navAccordionToggleIconClass,
} from '@components/Accordion/Accordion.css';
import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style } from '@vanilla-extract/css';

export {
  navAccordionSectionWrapperClass,
  navAccordionButtonClass,
  navAccordionToggleIconClass,
  navAccordionContentClass,
};

export const navAccordionContentListClass = style([
  sprinkles({
    paddingX: 0,
  }),
]);

export const navAccordionGroupClass = style([
  sprinkles({
    padding: 0,
    margin: 0,
  }),
]);

export const navAccordionArrowButtonClass = style([
  {
    alignItems: 'center',
    justifyContent: 'flex-start',
    textAlign: 'left',
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
    marginLeft: '$2',
    paddingBottom: '$2',
    paddingLeft: '$2',
  }),
  {
    borderLeft: `1px solid ${vars.colors.$layoutSurfaceSubtle}`,
  },
]);

export const navAccordionListItemClass = style({
  alignItems: 'center',
  display: 'flex',
  lineHeight: 1,
  listStyleType: 'none',
  paddingLeft: '5px',
  selectors: {
    '&:before': {
      content: '·',
      verticalAlign: 'middle',
      fontSize: vars.fontSizes.$xl,
    },
  },
});

export const navAccordionLinkClass = style([
  sprinkles({
    color: '$layoutSurfaceOverlay',
    paddingLeft: '$2',
  }),
  {
    textDecoration: 'none',
    selectors: {
      '&:active, &:hover': {
        color: `${vars.colors.$negativeSurface} !important`,
      },
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
]);

export const navAccordionLinkActiveClass = style({
  color: vars.colors.$negativeSurface,
});

export const navAccordionDeepLinkClass = style([
  sprinkles({
    color: '$gray60',
    fontSize: '$sm',
  }),
]);

export const navAccordionShallowLinkClass = style([
  sprinkles({
    display: 'none',
  }),
]);
