import { sprinkles } from '../../styles';

import { createVar, style } from '@vanilla-extract/css';

export const inputStatusColor = createVar();

export const titleContainer = style([
  sprinkles({
    display: 'flex',
    fontSize: '$sm',
    fontWeight: '$medium',
    flexDirection: 'column',
    justifyContent: 'center',
  }),
  {
    alignSelf: 'stretch',
  },
]);

export const valueIconContainer = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '$2',
  }),
]);

export const valueContainer = style([
  sprinkles({
    display: 'inline-block',
    fontFamily: '$mono',
    fontWeight: '$semiBold',
    width: '100%',
  }),
  {
    wordBreak: 'break-word',
    flex: '1',
  },
]);

export const iconContainer = style([
  sprinkles({
    width: '$6',
    height: '$6',
  }),
]);
