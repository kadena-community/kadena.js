import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const mainContentStyle = style([
  {
    alignSelf: 'stretch',
    width: '60%',
  },
]);

export const headerTextStyle = style([
  sprinkles({
    fontSize: '$3xl',
    fontWeight: '$normal',
    fontFamily: '$main',
    display: 'flex',
    lineHeight: '$normal',
  }),
  {
    alignSelf: 'stretch',
  },
]);

export const formStyle = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  }),
]);

export const accountFormStyle = style([
  sprinkles({
    padding: '$4',
    borderRadius: '$sm',
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '$10',
    paddingTop: '$10',
    paddingRight: '$10',
    paddingLeft: '$10',
  }),
  {
    alignSelf: 'stretch',
    background: 'rgba(71, 79, 82, 0.4)',
  },
]);

export const formButtonStyle = style([
  sprinkles({
    alignItems: 'center',
    marginTop: '$4',
    gap: '$8',
  }),
]);

export const formHeaderStyle = style([
  sprinkles({
    display: 'flex',
    paddingTop: '$6',
    paddingRight: '$10',
    paddingLeft: '$10',
    alignItems: 'flex-start',
    gap: '$2',
  }),
  {
    alignSelf: 'stretch',
    background: 'rgba(71, 79, 82, 0.4)',
  },
]);

export const formHeaderTitleStyle = style([
  sprinkles({
    fontSize: '$xl',
    fontFamily: '$main',
    fontWeight: '$semiBold',
    lineHeight: '$normal',
    color: '$neutral6',
  }),
]);

export const infoBoxStyle = style([
  sprinkles({
    fontSize: '$base',
    padding: '$2',
    borderRadius: '$sm',
    display: 'flex',
    flexDirection: 'column',
    gap: '$6',
  }),
]);
