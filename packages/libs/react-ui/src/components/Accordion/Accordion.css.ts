import { sprinkles } from '@theme/sprinkles.css';
import { vars } from '@theme/vars.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const accordionSectionClass = style([
  sprinkles({
    display: 'block',
    flexGrow: 1,
    marginBottom: '$6',
  }),
  {
    selectors: {
      '&:last-child': {
        marginBottom: 0,
      },
    },
  },
]);

export const accordionSectionHeadingClass = style([
  {
    alignItems: 'center',
    background: 'none',
    border: 'none',
    borderBottom: `1px solid ${vars.colors.$gray20}`,
    cursor: 'pointer',
    display: 'flex',
    padding: 0,
    textAlign: 'left',
    transition: 'color 0.2s ease 0s',
    width: '100%',
    selectors: {
      '&.isOpen': {
        border: 'none',
      },
    },
  },
]);

export const accordionTitleClass = style([
  sprinkles({
    display: 'block',
    fontSize: '$base',
    fontWeight: '$medium',
    paddingBottom: '$2',
    width: '100%',
  }),
]);

export const toggleButtonClass = style([
  sprinkles({
    background: 'none',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    paddingBottom: '$2',
  }),
]);

export const toggleIconClass = style([
  {
    transition: 'transform 0.2s ease 0s',
    transform: 'rotate(45deg)',
    selectors: {
      '&.isOpen': {
        transform: 'rotate(0deg)',
      },
    },
  },
]);

export const accordionContentWrapperClass = style([
  sprinkles({
    paddingTop: 0,
    paddingBottom: '$2',
  }),
]);
