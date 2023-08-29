import { sprinkles } from '@theme/sprinkles.css';
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
  sprinkles({
    cursor: 'pointer',
    display: 'flex',
  }),
  {
    transition: 'color 0.2s ease 0s',
    borderBottom: '1px solid',
  },
]);

export const accordionTitleClass = style([
  sprinkles({
    alignItems: 'center',
    display: 'flex',
    fontSize: '$base',
    fontWeight: '$medium',
    justifyContent: 'space-between',
    paddingBottom: '$2',
    width: '100%',
  }),
]);

export const accordionTitleVariants = styleVariants({
  closed: [sprinkles({ color: '$negativeContrast' })],
  opened: [sprinkles({ color: '$foreground' })],
});

export const toggleButtonClass = style([
  sprinkles({
    background: 'none',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
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
    paddingTop: '$2',
    paddingBottom: '$2',
  }),
]);
