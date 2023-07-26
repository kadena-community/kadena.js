import { sprinkles } from '@theme/sprinkles.css';
import { style, styleVariants } from '@vanilla-extract/css';

export const accordionSectionClass = style([
  sprinkles({
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
export const accordionTitleClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    fontSize: '$base',
    fontWeight: '$medium',
    paddingBottom: '$2',
  }),
  {
    transition: 'color 0.2s ease 0s',
    borderBottom: '1px solid',
  },
]);
export const accordionTitleVariants = styleVariants({
  closed: [sprinkles({ color: '$negativeContrast' })],
  opened: [sprinkles({ color: '$foreground' })],
});

export const toggleButtonClass = style([
  sprinkles({
    border: 'none',
    background: 'none',
    color: 'inherit',
  }),
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
