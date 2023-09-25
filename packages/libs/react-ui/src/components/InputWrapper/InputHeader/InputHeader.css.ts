import { sprinkles } from '../../../styles';

import { style } from '@vanilla-extract/css';

export const headerClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '$3',
    marginY: '$2',
  }),
]);

export const infoClass = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: '$1',
    fontSize: '$xs',
    marginLeft: 'auto',
    color: '$foreground',
  }),
]);

export const tagClass = style([
  sprinkles({
    backgroundColor: '$foreground',
    color: '$background',
    borderRadius: '$sm',
    paddingX: '$2',
    fontSize: '$xs',
    fontWeight: '$semiBold',
    display: 'inline-block',
  }),
  {
    paddingTop: '0.05rem',
    paddingBottom: '0.05rem',
  },
]);
