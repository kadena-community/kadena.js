import { sprinkles } from '@kadena/react-ui/theme';

import { style } from '@vanilla-extract/css';

export const formContentStyle = style([
  sprinkles({
    position: 'relative',
    // zIndex: -1,
  }),
  {
    width: '680px',
  },
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
    // alignItems: '',
    display: 'flex',
    flexDirection: 'row-reverse',
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
  {
    background: 'rgba(71, 79, 82, 0.4)',
    width: '40%',
    alignSelf: 'stretch',
  },
]);

export const infoTitleStyle = style([
  sprinkles({
    fontSize: '$base',
    marginBottom: '$2',
    textAlign: 'center',
  }),
]);

export const gasInputsStyle = style([
  sprinkles({
    gap: '$sm',
  }),
]);

export const sidebarLinksStyle = style([
  sprinkles({
    width: '100%',
    marginBottom: '$md',
    position: 'absolute',
    bottom: 0,
  }),
]);
