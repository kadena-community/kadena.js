import { sprinkles } from '@theme/sprinkles.css';
import { style } from '@vanilla-extract/css';

export const accordionSectionWrapperClass = style([
  sprinkles({
    display: 'block',
    marginBottom: '$6',
    borderColor: {
      lightMode: '$gray20',
      darkMode: '$gray40',
    },
  }),
  {
    borderBottom: `1px solid`,
    selectors: {
      '&:last-child': {
        marginBottom: 0,
      },
    },
  },
]);

export const accordionButtonClass = style([
  sprinkles({
    background: 'none',
    border: 'none',
    color: '$neutral5',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '$base',
    fontWeight: '$medium',
    justifyContent: 'space-between',
    padding: 0,
    paddingBottom: '$2',
    textAlign: 'left',
    width: '100%',
  }),
]);

export const accordionToggleIconClass = style([
  sprinkles({
    color: '$neutral5',
  }),
  {
    transform: 'rotate(45deg)',
    transition: 'transform 0.2s ease',
    selectors: {
      '&.isOpen': {
        transform: 'rotate(0deg)',
      },
    },
  },
]);

export const accordionContentClass = style([
  sprinkles({
    color: '$neutral5',
    fontSize: '$base',
    overflow: 'hidden',
    paddingBottom: '$2',
    paddingTop: '$2',
  }),
]);
