import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const mainContentStyle = style([
  sprinkles({
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '$16',
  }),
]);

export const formStyle = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  }),
  {
    width: '75%',
  },
]);

export const accountFormStyle = style([
  sprinkles({
    padding: '$4',
    borderRadius: '$sm',
    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'flex-start',
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

export const sideContentStyle = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
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

export const infoTitleStyle = style([
  sprinkles({
    fontSize: '$base',
    marginBottom: '$2',
    textAlign: 'center',
  }),
]);
