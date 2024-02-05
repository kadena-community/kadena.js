import { style } from '@vanilla-extract/css';
import { sprinkles } from '../../styles/sprinkles.css';

export const titleContainer = style([
  sprinkles({
    display: 'flex',
    fontSize: '$sm',
    fontWeight: '$medium',
    flexDirection: 'column',
    justifyContent: 'center',
    color: '$neutral4',
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
    color: '$neutral6',
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
    color: '$neutral6',
  }),
]);
