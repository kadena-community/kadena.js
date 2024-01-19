import { style } from '@vanilla-extract/css';
import { sprinkles } from '../../styles/sprinkles.css';
import { vars } from '../../styles/vars.css';

export const accordionSectionClass = style([
  sprinkles({
    display: 'block',
    marginBottom: '$4',
    overflow: 'hidden',
  }),
  {
    borderBottom: `1px solid ${vars.colors.$borderDefault}`,
    selectors: {
      '&:last-child': {
        marginBottom: 0,
      },
    },
  },
]);

export const accordionHeadingTitleClass = style([
  sprinkles({
    fontSize: '$base',
  }),
]);

export const accordionButtonClass = style([
  sprinkles({
    alignItems: 'center',
    background: 'none',
    border: 'none',
    color: '$neutral5',
    cursor: 'pointer',
    display: 'flex',
    fontSize: '$base',
    fontWeight: '$semiBold',
    justifyContent: 'space-between',
    padding: 0,
    paddingBottom: '$2',
    paddingRight: '$1',
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
        transform: 'rotate(90deg)',
      },
    },
  },
]);

export const accordionContentClass = style([
  sprinkles({
    color: '$neutral5',
    fontSize: '$base',
    margin: 0,
    overflow: 'hidden',
    padding: 0,
    paddingBottom: '$2',
  }),
]);
